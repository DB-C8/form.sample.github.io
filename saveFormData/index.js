module.exports = async function (context, req) {
    // Check if the request method is POST
    if (req.method === 'POST') {
        const formData = req.body;

        // Validate the incoming data (you can add more validation as needed)
        if (!formData || !formData.orgName || !formData.firstName || !formData.lastName) {
            context.res = {
                status: 400,
                body: "Please provide all required fields."
            };
            return;
        }

        // Here you would typically save the data to a database
        // For example, using Azure Cosmos DB, Azure SQL, etc.
        // This is a placeholder for your database save logic
        // await saveToDatabase(formData);

        context.res = {
            status: 200,
            body: "Form data saved successfully."
        };
    } else {
        context.res = {
            status: 405,
            body: "Method not allowed. Please use POST."
        };
    }
}; 