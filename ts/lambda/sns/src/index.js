const handler = async (event) => {
    console.log("Hello SNS")
    event.Records.forEach(record => {
        const { Sns } = record;
        console.log(Sns.Message);
    });
    return {};
}

exports.handler = handler;
