const fetchFeedContent = async (feedUrlInput, lastProcessedData) => {
  try {
    // Parse the last processed data (if available)
    let lastProcessed = {};
    if (lastProcessedData && typeof lastProcessedData === 'string') {
      try {
        lastProcessed = JSON.parse(lastProcessedData);
      } catch (e) {
        console.log("Error parsing last processed data:", e.message);
      }
    }
    
    // Split the input by commas to handle multiple URLs
    const feedUrls = feedUrlInput.split(',');
    console.log(`Found ${feedUrls.length} URLs to process`);
    
    let allResults = [];
    let newLastProcessed = {}; // To store updated timestamps
    
    // Process each URL individually
    for (let i = 0; i < feedUrls.length; i++) {
      const currentUrl = feedUrls[i].trim();
      console.log(`Processing URL ${i+1}/${feedUrls.length}: ${currentUrl}`);
      
      try {
        const response = await fetch(currentUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/110.0.0.0 Safari/537.36'
          }
        });

        if (!response.ok) {
          console.log(`HTTP error for URL ${currentUrl}: ${response.status}`);
          continue; // Skip this URL and move to the next one
        }

        const rssContent = await response.text();
        console.log(`Successfully fetched content from URL ${i+1}`);

        // Detect feed type: RSS 2.0 (<item>) or Atom (<entry>)
        const isAtom = rssContent.includes("<feed") && rssContent.includes("<entry>");
        const itemBlockRegex = isAtom ? /<entry>([\s\S]*?)<\/entry>/g : /<item>([\s\S]*?)<\/item>/g;

        let urlItems = [];
        let blockMatch;
        let newestTimestamp = lastProcessed[currentUrl] || 0;

        while ((blockMatch = itemBlockRegex.exec(rssContent)) !== null) {
          const itemXml = blockMatch[1];

          // Extract fields based on feed type
          const titleMatch = /<title.*?>(.*?)<\/title>/.exec(itemXml);
          const linkMatch  = isAtom 
            ? /<link[^>]+rel="alternate"[^>]+href="([^"]+)"/.exec(itemXml) 
            : /<link>(.*?)<\/link>/.exec(itemXml);
          
          // Extract pubDate or updated date
          const pubDateMatch = isAtom
            ? /<updated>(.*?)<\/updated>/.exec(itemXml) || /<published>(.*?)<\/published>/.exec(itemXml)
            : /<pubDate>(.*?)<\/pubDate>/.exec(itemXml);
          
          // Improved description extraction
          const descMatch  = isAtom 
            ? /<content.*?>([\s\S]*?)<\/content>/.exec(itemXml) 
            || /<summary.*?>([\s\S]*?)<\/summary>/.exec(itemXml) // Atom feeds sometimes use <summary>
            : /<description>([\s\S]*?)<\/description>/.exec(itemXml);

          // Improved Image Extraction
          const imgMatch = isAtom 
            ? /<media:content[^>]+url="([^"]+)"/.exec(itemXml)  // Atom: media:content
            || /<enclosure[^>]+url="([^"]+)"/.exec(itemXml)  // Atom: enclosure
            : /<img[^>]+src="([^"]+)"/.exec(itemXml);  // RSS: img in description

          const title = titleMatch ? titleMatch[1].trim() : "";
          const link = linkMatch ? linkMatch[1].trim() : "";
          let description = descMatch ? descMatch[1].trim() : "";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
          
          // Convert publication date to timestamp for comparison
          const timestamp = pubDate ? new Date(pubDate).getTime() : 0;
          
          // Update the newest timestamp for this URL if applicable
          if (timestamp > newestTimestamp) {
            newestTimestamp = timestamp;
          }
          
          // Skip items that are older than or equal to the last processed timestamp
          if (timestamp <= lastProcessed[currentUrl]) {
            console.log(`Skipping already processed item: ${title}`);
            continue;
          }

          // Extract image from <description> if <img> is found inside it
          const descImgMatch = description.match(/<img[^>]+src="([^"]+)"/);
          const imageUrl = imgMatch 
            ? imgMatch[1].trim() 
            : descImgMatch 
              ? descImgMatch[1].trim() 
              : null;

          // Remove all HTML tags, extra spaces, and unnecessary characters
          description = description.replace(/<[^>]*>/g, ''); // Remove HTML
          description = description.replace(/\s+/g, ' ').trim();
          description = description.replace(/}}}/g, '');
          description = description.replace(/\]\]>/g, '');

          // Extract only the first sentence as intro text
          const introText = description.split('. ')[0] + '.';

          urlItems.push({
            title,
            link,
            image: imageUrl,
            description: introText, // Only return the intro text
            sourceUrl: currentUrl, // Add the source URL for reference
            pubDate,
            timestamp
          });
        }
        
        // Store the newest timestamp for this URL
        newLastProcessed[currentUrl] = newestTimestamp;
        
        console.log(`Found ${urlItems.length} new items in URL ${i+1}`);
        // Add these items to the overall results
        allResults = allResults.concat(urlItems);
        
      } catch (urlError) {
        console.log(`Error processing URL ${currentUrl}: ${urlError.message}`);
        // Continue to the next URL
      }
    }

    return {
      output: {
        itemCount: allResults.length,
        allItems: allResults,
        processedUrls: feedUrls.length,
        lastProcessed: JSON.stringify(newLastProcessed) // Return this to store for next run
      }
    };

  } catch (error) {
    console.error("RSS Processing Error:", error.message);
    return { 
      output: { 
        error: `Error processing RSS feeds: ${error.message}`,
        originalInput: feedUrlInput
      } 
    };
  }
};

// Get the URL and last processed data from the input
const feedUrl = inputData.feedUrl;
const lastProcessedData = inputData.lastProcessed || '{}';
console.log("Raw input feedUrl:", feedUrl);

// Execute the function
return fetchFeedContent(feedUrl, lastProcessedData);
