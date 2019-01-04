import { saveAs } from 'file-saver';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

import config from '../../config';
import { formatThousands, round } from '../../utils';

// fetch fonts & images on init for use in PDF
// let MSLight, MSSemiBold, Logo
// fetch('assets/fonts/Montserrat-Light.ttf')
//   .then(response => response.arrayBuffer())
//   .then(font => {
//     MSLight = font
//   })

// fetch('assets/fonts/Montserrat-SemiBold.ttf')
//   .then(response => response.arrayBuffer())
//   .then(font => {
//     MSSemiBold = font
//   })

let Logo;
fetch('/assets/graphics/meta/android-chrome.png')
  .then(response => response.arrayBuffer())
  .then(logo => {
    Logo = logo;
  });

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettifyString (string) {
  return string.split('-').map(m => capitalize(m)).join(' ');
}

// label and value are strings to print.
// dlLeft and dlTop are pixel positions of the full container
// index is the index of the item
function drawDefinitionItem (label, value, dlLeft, dlTop, index, doc, options) {
  doc.fillColor(options.secondaryFontColor, 1)
    .font(options.boldFont)
    .text(label, dlLeft, dlTop + (index * 44));

  doc.fontSize(8)
    .font(options.baseFont)
    .fillColor(options.baseFontColor);

  doc.text(value, dlLeft, dlTop + 14 + (index * 44), {
    width: options.colWidthTwoCol,
    align: 'left'
  });
}

function drawFooter (doc, options) {
  doc.rect(0, options.pageHeight - options.margin * 2 - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc.fontSize(8)
    .fillOpacity(1);

  // // Footer
  doc.image(Logo, options.margin, options.pageHeight - (options.margin * 1.5), { height: 20 });

  // Left Title
  doc.fillColor(options.primaryColor)
    .font(options.boldFont)
    .text(config.appTitle, options.margin + 20 + 8, options.pageHeight - (options.margin * 1.5), {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'left',
      link: config.baseUrl
    });

  // Left Subtitle
  doc.fillColor(options.secondaryFontColor)
    .font(options.baseFont)
    .text(config.baseUrl, options.margin + 20 + 8, options.pageHeight - (options.margin * 1.5) + 12, {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'left'
    });

  // Right license
  doc.text('Creative Commons BY 4.0', options.pageWidth - options.colWidthTwoCol - options.margin, options.pageHeight - options.margin * 1.5, {
    width: options.colWidthTwoCol,
    height: 16,
    align: 'right',
    link: 'https://creativecommons.org/licenses/by/4.0/'
  });

  // Right date
  doc.text(new Date().getFullYear(), options.pageWidth - options.colWidthTwoCol - options.margin, options.pageHeight - options.margin * 1.5 + 12, {
    width: options.colWidthTwoCol,
    height: 16,
    align: 'right'
  });
}

export function downloadPDF (props) {
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  // Hacky way to get canvas element. Better would be to use .getCanvas()
  // on the map https://www.mapbox.com/mapbox-gl-js/api/#map#getcanvas
  const canvas = document.getElementsByClassName('mapboxgl-canvas')[0];
  const dataURL = canvas.toDataURL('image/png');
  const aspectRatio = canvas.height / canvas.width;

  const options = {
    pageWidth: 612, // Letter; http://www.a4papersize.org/a4-paper-size-in-pixels.php
    pageHeight: 792,
    headerHeight: 96,
    baseFont: 'Helvetica',
    boldFont: 'Helvetica-Bold',
    baseFontColor: '#3a455c',
    secondaryFontColor: '#6d788f',
    primaryColor: '#5860ff',
    colWidthTwoCol: 252,
    gutterTwoCol: 28,
    colWidthThreeCol: 160,
    gutterThreeCol: 26,
    margin: 40
  };

  // Limit map height to a column width. This results in a square aspect ratio of the map
  const mapWidth = options.colWidthThreeCol * 2 + options.gutterThreeCol;
  const mapHeight = aspectRatio > 1 ? mapWidth : mapWidth * aspectRatio;

  const { country, model, scenario, defaultFilters, leversState, filtersState } = props;

  // // HEADER

  // Left Title
  doc.fillColor(options.baseFontColor)
    .fontSize(20)
    .text(country.data.name, options.margin, options.margin);

  // Left Subtitle
  doc.fillColor(options.secondaryFontColor)
    .fontSize(8)
    .text(model.data.name, options.margin, options.margin + 24);

  // Right Title
  doc.fillColor(options.baseFontColor)
    .fontSize(12)
    .text(config.appTitle, options.pageWidth - options.colWidthTwoCol - options.margin, options.margin, {
      width: options.colWidthTwoCol,
      align: 'right'
    });

  // Right Subtitle
  doc.fillColor(options.secondaryFontColor)
    .fontSize(8)
    .text(config.appDescription, options.pageWidth - options.colWidthTwoCol - options.margin, options.margin + 16, {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'right'
    });

  // // MAP AREA
  // Map area has a three column layout

  // Map (2/3)
  doc.image(dataURL, options.margin, options.headerHeight, { fit: [options.pageWidth, mapHeight] });

  // Map area outline
  doc.rect(0, options.headerHeight, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc.rect(0, options.headerHeight + mapHeight - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Legend (1/3)
  let legendLeft = options.pageWidth - options.margin - options.colWidthThreeCol;

  // Legend header
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1)
    .text('Technologies', legendLeft, options.headerHeight + 20);

  doc.rect(legendLeft, options.headerHeight + 38, 28, 2)
    .fill(options.primaryColor);

  // Legend
  const layerKeys = Object.keys(scenario.data.layers);
  layerKeys.forEach((key, index) => {
    // Currently picked up from the app config. Will be switched to model config from the props
    let legendItem = config.techLayers.find(l => l.id === key);

    let itemTop = options.headerHeight + 56 + (index * 24);

    // Legend marker
    doc.roundedRect(legendLeft, itemTop + 1, 12, 4, 2)
      .fillColor(legendItem.color, 1)
      .fill();

    // Legend label
    doc.fillColor(options.secondaryFontColor, 1)
      .fontSize(8)
      .text(prettifyString(legendItem.label), legendLeft + 12 + 4, itemTop);
  });

  // // RESULTS SUMMARY
  // Results summary has a 3 column layout
  const outputs = [
    { name: 'People affected', id: 'electrifiedPopulation' },
    { name: 'Investment required ', id: 'investmentCost' },
    { name: 'Added capacity', id: 'newCapacity' }
  ];

  doc.rect(0, options.headerHeight + mapHeight, options.pageWidth, options.pageHeight - (options.headerHeight + mapHeight) - options.margin * 2)
    .fill('#f6f7f7');

  // Result headers
  outputs.forEach((output, index) => {
    let outputLeft = options.margin + ((options.colWidthThreeCol + options.gutterThreeCol) * index);

    doc.fillColor(options.baseFontColor)
      .fontSize(12)
      .text(output.name, outputLeft, options.headerHeight + mapHeight + 20);

    doc.rect(outputLeft, options.headerHeight + mapHeight + 38, 28, 2)
      .fill(options.primaryColor);

    layerKeys.forEach((layer, i) => {
      // Currently picked up from the app config. Will be switched to model config from the props
      let layerItem = config.techLayers.find(l => l.id === layer);
      let itemTop = options.headerHeight + mapHeight + 112 - 2 + (i * 24);

      // Marker
      doc.roundedRect(outputLeft, itemTop + 1, 12, 4, 2)
        .fillColor(layerItem.color, 1)
        .fill();

      let itemValue = formatThousands(round(scenario.data.summaryByType[output.id][layer], 0));
      doc.fontSize(8)
        .fillColor(options.baseFontColor)
        .text(itemValue, outputLeft, itemTop, {
          width: options.colWidthThreeCol,
          align: 'right'
        });

      if (i !== layerKeys.length - 1) {
        doc.rect(outputLeft, itemTop + 16, options.colWidthThreeCol, 1)
          .fillColor('#192F35', 0.08)
          .fill();
      }
    });
  });

  drawFooter(doc, options);

  // // SECOND PAGE
  doc.addPage();

  // // BODY
  // Body has a 2 column layout

  // Scenario header - left column
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1)
    .text('Scenarios', options.margin, options.headerHeight + 20);

  doc.rect(options.margin, options.headerHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const scenarioDescription = 'The model determined the least cost electrification option for each area based on the following assumptions.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    .text(scenarioDescription, options.margin, options.headerHeight + 52, {
      width: options.colWidthTwoCol,
      align: 'left'
    });

  // Scenario levers - left column
  const levers = model.data.levers;
  levers.forEach((lever, index) => {
    let leverOption = lever.options.find(o => o.id === leversState[index]);

    drawDefinitionItem(lever.label, leverOption.value, options.margin, options.headerHeight + 112, index, doc, options);
  });

  // Filter header - right column
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor)
    .text('Filters', options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + 20);

  doc.rect(options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const filterDescription = 'The model results were further narrowed down using the following filters.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    .text(filterDescription, options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + 52, {
      width: options.colWidthTwoCol,
      align: 'left'
    });

  // Filter options - right column
  let filterLeft = options.margin + options.colWidthTwoCol + options.gutterTwoCol;

  // Print only the filters that are active
  const activeFilters = defaultFilters
    .reduce((acc, def, index) => def ? acc : acc.concat(model.data.filters[index]), []);

  if (activeFilters.length) {
    activeFilters.forEach((filter, index) => {
      let filterValues = filtersState[filter.id];

      // Depending on the filter type, generate a string for the value.
      // Range is simple min - max, anything else a stringified array
      let valueString = filter.type === 'range'
        ? `${filterValues.min} - ${filterValues.max}`
        : filterValues
          .reduce((acc, value) => acc.concat(filter.options.find(f => f.value === value)['label']), [])
          .toString();

      drawDefinitionItem(filter.label, valueString, filterLeft, options.headerHeight + 112, index, doc, options);
    });
  } else {
    doc.fillColor(options.secondaryFontColor, 1)
      .fontSize(8)
      .text('No filters applied to the model results.', filterLeft, options.headerHeight + 112 - 2);
  }

  drawFooter(doc, options);

  // // THIRD PAGE
  doc.addPage();

  // About the model
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1)
    .text('About the model', options.margin, options.headerHeight + 20);

  doc.rect(options.margin, options.headerHeight + 38, 28, 2)
    .fill(options.primaryColor);

  doc.fontSize(10);
  doc.fillColor(options.secondaryFontColor)
    .text(model.data.description, options.margin, options.headerHeight + 52, {
      align: 'left'
    });

  drawFooter(doc, options);

  doc.end();
  stream.on('finish', () => {
    saveAs(stream.toBlob('application/pdf'), `gep-${scenario.data.id}.pdf`);
  });
}

export default downloadPDF;
