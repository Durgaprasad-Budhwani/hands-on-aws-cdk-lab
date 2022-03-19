exports.handler = async function(event, context) {
  console.log("Hello SQS")
  event.Records.forEach(record => {
    const { body } = record;
    console.log(body);
  });
  return {};
}
