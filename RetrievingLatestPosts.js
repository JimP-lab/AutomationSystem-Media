const pages = [
  { pageId: "100792456661083", pageAccessToken: "EAAXMPs4QL9wBO7ZBWXbY201UFwd1cFHEH6B3mxiYnmo65ZCEBAu7U5S4PL3sPcM9r0ZCE3ClAK6oct6uqnCWsI8phZAcVsw9BhZAnuteNrhP3NAmmNj4i1l5WagzdwhTEEKXpoJWW3ZCzQPeLm7pCROgzgabMWymimp7ZBzZCnHTpHOvCEv8xhyPZAkPKVbRZCsEYyqwyFPZBUZD"},
  { pageId: "1501100376789442", pageAccessToken: "EAAXMPs4QL9wBO0lSpn3zvOhZAed7jrpWIy4sE162ga10A45C0nX8lu9MW2NgJnzMrKPyGZAdCa0zPwWTb0x6xJAcJsU6nPvmF6J8IofZBZADVTlAHgOP3IJIcP52Eiijva0phalZAiZBXR8h8mxcRSGGqBzPa0BeMgi1a8EXnJZA3T7EiNdf4vUw2vCZAgaeytlmvQRi5pNq"},
  { pageId: "125340620853071", pageAccessToken: "EAAXMPs4QL9wBOZB14ksAjVFVC0GS3JOq7bJSbyhn4hK8xLMePKCcmHTCnAbeYnVmC2FrM80tu9vJTqB4FiUfQxt4IW7Izv0AjMOdutTKZAPOEj0Xf5VmEB7U3T6j76xg55Y25TO8woFCNQG8RZBED9ZB3Ya720mzUOwwtqk6NzLRCZBAPhdv8ZAZB823Qd5RgFIoFQbSA4ZD"},
  { pageId: "1751222678427919", pageAccessToken: "EAAXMPs4QL9wBOZBSFhoH2zxah4d1sfKKxmbSSh4GbqmPMD4d2hf0u2SpkCkM18V5lNBgDt1O9PzuZASfUuc2lE8N1J1Gizdh5fHsvr0AZATf2Qvwa9wrCuZC1JYu3pLSO42cMWgYLsUtYXVWTpMTHgqPWX4g6vXrqb9HoyhiF8c4caovsNvZBShZBkMBLIOWpVRWr0OYCb"},
];
const fetchFacebookPostsForAllPages = async () => {
  try {
    // Function to resolve shortened URLs (dlvr.it, bit.ly, etc.)
    const resolveShortenedUrl = async (shortUrl) => {
      try {
        const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
        return response.url; // Return the final redirected URL
      } catch (error) {
        console.warn("Error resolving shortened URL:", shortUrl);
        return null;
      }
    };

    // Function to extract and resolve article links
    const extractArticleLinkFromPost = async (post) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const messageMatches = post.message ? post.message.match(urlRegex) : null;

      let articleLink = null;

      // First check if the link exists inside the post message
      if (messageMatches) {
        articleLink = messageMatches[0];
      }

      // If not found, check the post attachments
      if (!articleLink && post.attachments && post.attachments.data.length > 0) {
        articleLink = post.attachments.data[0].url; // Get first attachment URL
      }

      if (articleLink) {
        // Decode Facebook tracking links (l.facebook.com redirections)
        try {
          const decodedUrl = decodeURIComponent(articleLink);
          if (decodedUrl.includes("l.facebook.com/l.php?u=")) {
            const cleanUrl = decodedUrl.split("l.php?u=")[1].split("&")[0]; // Extract the real URL
            articleLink = decodeURIComponent(cleanUrl);
          }
        } catch (error) {
          console.warn("Error decoding URL:", articleLink);
        }

        // Resolve dlvr.it short links to get the original URL
        if (articleLink.includes("dlvr.it/")) {
          try {
            const resolvedUrl = await resolveShortenedUrl(articleLink);
            if (resolvedUrl) {
              articleLink = resolvedUrl; // Replace with real URL
            }
          } catch (error) {
            console.warn("Could not resolve shortened URL:", articleLink);
          }
        }

        return articleLink; // Return properly formatted URL
      }

      return null; // No valid link found
    };

    // Function to fetch posts for a specific page
    const fetchPosts = async (pageId, pageAccessToken) => {
      try {
        const apiUrl = `https://graph.facebook.com/v18.0/${encodeURIComponent(pageId)}/feed`;
        const params = new URLSearchParams({
          access_token: pageAccessToken,
          limit: "10",
          fields: "id,permalink_url,message,attachments{url}"
        });

        const response = await fetch(`${apiUrl}?${params.toString()}`, {
          method: "GET",
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid response format from Facebook API");
        }

        // Process each post to extract the article link
        const posts = await Promise.all(data.data.map(async (post) => ({
          id: post.id,
          link: post.permalink_url,
          articleLink: await extractArticleLinkFromPost(post), // Extract & resolve article link
          pageAccessToken: pageAccessToken // Add the pageAccessToken to the post data
        })));

        return posts;
      } catch (error) {
        console.warn(`Error fetching posts for page ${pageId}:`, error.message);
        return [];
      }
    };

    // Fetch posts for all pages concurrently
    const allPosts = await Promise.all(pages.map(({ pageId, pageAccessToken }) => fetchPosts(pageId, pageAccessToken)));

    const output = {
      success: true,
      total_posts: allPosts.flat().length,
      posts: allPosts.flat()
    };

    return output;
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Call the function to fetch posts
return fetchFacebookPostsForAllPages();
