// Function to decode URLs
const decodeURL = (encodedUrl) => {
    try {
        let url = decodeURIComponent(encodedUrl);
        let cleanedUrl = url.replace(/\?.*/, ""); // Remove tracking parameters
        return cleanedUrl;
    } catch (error) {
        console.warn(`Error decoding URL: ${encodedUrl}`, error);
        return encodedUrl; // Return as-is if decoding fails
    }
};

// Function to post a comment on Facebook with a timeout limit (5s per request)
const postCommentOnFacebook = async (postId, articleLink, pageAccessToken) => {
    try {
        const commentUrl = `https://graph.facebook.com/v16.0/${postId}/comments?access_token=${pageAccessToken}`;
        const originalArticleLink = decodeURL(articleLink);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Set 5s timeout

        const response = await fetch(commentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `🔗 Read the full article here: ${originalArticleLink}` }),
            signal: controller.signal,
        });

        clearTimeout(timeout);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Error posting comment: ${responseData.error?.message || 'Unknown error'}`);
        }

        return { postId, status: "Success", response: responseData };
    } catch (error) {
        return { postId, status: "Failed", reason: error.message };
    }
};

// Function to match Facebook posts with the correct article link and post comments in batches
const matchAndPostComment = async (postIds, postLinks, articleLinks, pageAccessToken) => {
    let results = [];
    const batchSize = 5; // Process 5 comments in parallel

    for (let i = 0; i < postIds.length; i += batchSize) {
        const batch = postIds.slice(i, i + batchSize).map(async (postId, index) => {
            const postLink = postLinks[i + index]?.trim();
            const articleLink = articleLinks[i + index]?.trim();

            if (!postId || !postLink || !articleLink || !articleLink.startsWith("http")) {
                console.warn(`⚠️ Skipping row ${i + index + 1} due to missing or invalid data.`);
                return { row: i + index + 1, postId, status: "Skipped", reason: "Missing Data" };
            }

            try {
                return await postCommentOnFacebook(postId, articleLink, pageAccessToken);
            } catch (error) {
                return { postId, status: "Failed", reason: error.message };
            }
        });

        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
    }

    return { success: true, results };
};

// Execute Function with Zapier Input Data
try {
    const { postId, postLink, articleLink, pageAccessToken } = inputData;

    if (!postId || !postLink || !articleLink || !pageAccessToken) {
        throw new Error("Missing required input data. Ensure all fields (Post ID, Post Link, Article Link, Page Access Token) are mapped correctly.");
    }

    const postIdArray = postId.split(",");
    const postLinkArray = postLink.split(",");
    const articleLinkArray = articleLink.split(",");

    return await matchAndPostComment(postIdArray, postLinkArray, articleLinkArray, pageAccessToken);
} catch (error) {
    return { error: error.message };
}
