const {google} = require('googleapis');

const serviceAccountKeyFile = "./project-emosync-5cc7841a1889.json";
const sheetId = process.env.GOOGLE_SHEETS_ID
const tabName = 'Form Responses 1'

// yg nika
// const range = 'B:AH'

// yg syifa 
const range = 'A:AI'

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}


async function sheetsServiceInit() {
  const googleSheetClient = await _getGoogleSheetClient();
  const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);

  const categories = [
    {key: 'attentionPositive', start: 0, end: 4},
    {key: 'attentionNegative', start: 4, end: 8},
    {key: 'relevancePositive', start: 8, end: 12},
    {key: 'relevanceNegative', start: 12, end: 16},
    {key: 'confidencePositive', start: 16, end: 20},
    {key: 'confidenceNegative', start: 20, end: 24},
    {key: 'satisfactionPositive', start: 24, end: 28},
    {key: 'satisfactionNegative', start: 28, end: 32}
  ];

  const mapScoreARCS = {};

  for (const category of categories) {
    const categoryData = data.slice(1).map((item) => {
      const categoryPositionData = item.slice(category.start, category.end);

      // yg nika
      // const getOnlyEmail = item[32]; // Fetch email from the current row

      // yg syifa
      const getOnlyEmail = item[1]; // Fetch email from the current row

      return {
        email: getOnlyEmail,
        data: categoryPositionData,
        score: categoryPositionData.reduce((acc, curr) => acc + parseInt(curr), 0)
      };
    });

    mapScoreARCS[category.key] = categoryData;
  }
  // const statements


  return mapScoreARCS;
}

async function getScoresByEmail(email) {
  const googleSheetClient = await _getGoogleSheetClient();
  const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);


  // yg nika
  // const categories = [
  //   {key: 'attentionPositive', start: 0, end: 4},
  //   {key: 'attentionNegative', start: 4, end: 8},
  //   {key: 'relevancePositive', start: 8, end: 12},
  //   {key: 'relevanceNegative', start: 12, end: 16},
  //   {key: 'confidencePositive', start: 16, end: 20},
  //   {key: 'confidenceNegative', start: 20, end: 24},
  //   {key: 'satisfactionPositive', start: 24, end: 28},
  //   {key: 'satisfactionNegative', start: 28, end: 32}
  // ];
  
  // yg syifa
  const categories = [
    {key: 'attentionPositive', start: 3, end: 7},
    {key: 'attentionNegative', start: 7, end: 11},
    {key: 'relevancePositive', start: 11, end: 15},
    {key: 'relevanceNegative', start: 15, end: 19},
    {key: 'confidencePositive', start: 19, end: 23},
    {key: 'confidenceNegative', start: 23, end: 27},
    {key: 'satisfactionPositive', start: 27, end: 31},
    {key: 'satisfactionNegative', start: 31, end: 35}
  ];

  const scoresByEmail = {};

  // console.log(data[1])
  for (const category of categories) {
    const categoryData = data.slice(1).map((item) => {
      // console.log(item[3])
      // console.log(item)
      const categoryPositionData = item.slice(category.start, category.end);

      // yg nika
      // const itemEmail = item[32]; // Fetch email from the current row

      // yg syifa
      const itemEmail = item[1]; // Fetch email from the current row

      if (itemEmail === email) {
        return {
          data: categoryPositionData,
          score: categoryPositionData.reduce((acc, curr) => acc + parseInt(curr), 0)
        };
      }
    }).filter(Boolean);

    scoresByEmail[category.key] = categoryData;
  }

  return scoresByEmail;
}

async function getScoreByEmailFormatted(email) {
  // Get scores for the provided email
  const scores = await getScoresByEmail(email);

  // Calculate total scores for positive and negative categories
  let totalPositiveScore = 0;
  let totalNegativeScore = 0;

  for (const category in scores) {
    if (category.includes('Positive')) {
      totalPositiveScore += scores[category][0].score;
    } else if (category.includes('Negative')) {
      totalNegativeScore += scores[category][0].score;
    }
  }

  // Determine the result based on total scores
  const result = totalPositiveScore >= totalNegativeScore ? 'positive' : 'negative';

  // Construct the response object
  const response = {
    email: email,
    attentionPositiveScore: scores['attentionPositive'][0].score,
    attentionNegativeScore: scores['attentionNegative'][0].score,
    relevancePositiveScore: scores['relevancePositive'][0].score,
    relevanceNegativeScore: scores['relevanceNegative'][0].score,
    confidencePositiveScore: scores['confidencePositive'][0].score,
    confidenceNegativeScore: scores['confidenceNegative'][0].score,
    satisfactionPositiveScore: scores['satisfactionPositive'][0].score,
    satisfactionNegativeScore: scores['satisfactionNegative'][0].score,
    totalPositiveScore: totalPositiveScore,
    totalNegativeScore: totalNegativeScore,
    result: result
  };

  return [response];
}


module.exports = {
  sheetsServiceInit,
  getScoresByEmail,
  getScoreByEmailFormatted
}