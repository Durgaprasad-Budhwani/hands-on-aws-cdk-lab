const handler = async (event) => {
    console.log("Hello From Lambda");
    console.log(JSON.stringify(event));

    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: "Hello from API Gateway"
        }
    }

    return {
        statusCode: 200,
        body: "Hello from API Gateway - POST"
    }

}

exports.handler = handler;