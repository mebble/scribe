/**
 * Resources:
 * https://support.google.com/docs/thread/137323848/how-to-update-all-cells-with-custom-function-on-sheet-open?hl=en
 * https://developers.google.com/apps-script/guides/triggers
 * https://developers.google.com/apps-script/guides/sheets#writing_data
 * https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
 * https://developers.google.com/apps-script/guides/sheets/functions#autocomplete
 * https://stackoverflow.com/questions/20718931/new-google-sheets-custom-functions-sometimes-display-loading-indefinitely
 */

const portfolioSheetName = 'portfolio-crypto';
const portfolioHistorySheetName = 'portfolio-crypto-history';
const portfolioLTPLOC = 'B7';
const sheetLOCs = [
    {
      name: 'portfolio',
      current: 'B3',
      PL: 'B4',
      PLP: 'B5',
    },
    {
      name: 'ETH',
      current: 'B14',
      PL: 'B15',
      PLP: 'B16',
    },
    {
      name: 'BTC',
      current: 'F14',
      PL: 'F15',
      PLP: 'F16',
    },
    {
      name: 'SOL',
      current: 'J14',
      PL: 'J15',
      PLP: 'J16',
    },
    {
      name: 'ADA',
      current: 'N14',
      PL: 'N15',
      PLP: 'N16',
    },
    {
      name: 'MATIC',
      current: 'R14',
      PL: 'R15',
      PLP: 'R16',
    },
];

/**
 * @customfunction
 */
function GETLTP(ticker, time) {
  Logger.log(`[INFO] Fetching LTP of ticker ${ticker} at ${time}`);
  const response = UrlFetchApp.fetch(`https://cryptoexrate.netlify.app/.netlify/functions/exchange-rate?ticker=${ticker}`);
  const { success, data } = JSON.parse(response.getContentText());
  if (!success) {
    throw new Error(`Failed to get LTP of ticker ${ticker}`);
  }
  Logger.log(`[INFO] ${ticker} data: ${JSON.stringify(data, null, 4)}`);
  return Number(data.last);
}

function updateLTP() {
  const newValue = new Date().toLocaleTimeString('en-IN', { timeZone: 'IST' });
  const cell = getSheet_(portfolioSheetName).getRange(portfolioLTPLOC);
  Logger.log(`[INFO] Setting LTP value to ${newValue}`);
  cell.setValue(newValue);
}

function appendPortfolio() {
  const sheet = getSheet_(portfolioHistorySheetName);
  const currentPortfolio = getCurrentPortfolio_();
  Logger.log(`[INFO] Appending to portfolio history: ${JSON.stringify(currentPortfolio, null, 4)}`);
  const portfolioEntry = [getCurrentDateTime_(), ...flattenPortfolio_(currentPortfolio)];
  sheet.appendRow(portfolioEntry);
}

function getCurrentPortfolio_() {
  const sheet = getSheet_(portfolioSheetName);
  const portfolio = sheetLOCs.map(({ name, current, PL, PLP }) => {
    return {
      name,
      current: sheet.getRange(current).getValue(),
      PL: sheet.getRange(PL).getValue(),
      PLP: sheet.getRange(PLP).getValue()
    };
  })
  return portfolio;
}

function flattenPortfolio_(portfolio) {
  return portfolio.flatMap(({ current, PL, PLP }) => [ current, PL, PLP ]);
}

function getCurrentDateTime_() {
  return new Date();
}

function getSheet_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet === null) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  return sheet;
}
