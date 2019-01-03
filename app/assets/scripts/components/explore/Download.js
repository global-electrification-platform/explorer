import { saveAs } from 'file-saver';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

import config from '../../config';

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

function drawFooter (doc, options) {
  doc.fontSize(8);
  doc.fillColor(options.secondaryFontColor, 1);

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
  const legendKeys = Object.keys(scenario.data.layers);
  legendKeys.forEach((key, index) => {
    // Currently picked up from the app config. Will be switched to model config from the props
    let legendItem = config.techLayers.find(l => l.id === key);

    let itemTop = options.headerHeight + 56 + (index * 24);

    // Legend marker
    doc.fill(legendItem.color)
      .roundedRect(legendLeft, itemTop + 1, 12, 4, 2);

    // Legend label
    doc.fillColor(options.secondaryFontColor, 1)
      .fontSize(8)
      .text(prettifyString(legendItem.label), legendLeft + 12 + 4, itemTop);
  });

  // // BODY
  // Body has a 2 column layout

  doc.rect(0, options.headerHeight + mapHeight, options.pageWidth, options.pageHeight - (options.headerHeight + mapHeight) - options.margin * 2)
    .fill('#f6f7f7');

  doc.rect(0, options.pageHeight - options.margin * 2 - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Result Header
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor)
    .text('Results', options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + mapHeight + 20);

  doc.rect(options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + mapHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const loremTwo = 'A summary of the results.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    .text(loremTwo, options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + mapHeight + 52, {
      width: options.colWidthTwoCol,
      align: 'left'
    });

  // Analysis
  const { electrifiedPopulation, investmentCost, newCapacity } = scenario.data.summary;
  const outputs = [
    { name: 'People affected', value: electrifiedPopulation },
    { name: 'Investment required ', value: investmentCost },
    { name: 'Added capacity', value: newCapacity }
  ];
  outputs.forEach((output, index) => {
    doc.fontSize(8);
    doc.fillColor(options.secondaryFontColor, 1)
      .text(output.name, options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + mapHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      .text(output.value, options.pageWidth - options.colWidthTwoCol - options.margin, options.headerHeight + mapHeight + 112 - 2 + (index * 24), {
        width: options.colWidthTwoCol,
        align: 'right'
      });

    if (index !== outputs.length - 1) {
      doc.rect(options.margin + options.colWidthTwoCol + options.gutterTwoCol, options.headerHeight + mapHeight + 126 + (index * 24), options.colWidthTwoCol, 1)
        .fillColor('#192F35', 0.08)
        .fill();
    }
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

    doc.fontSize(8);
    doc.fillColor(options.secondaryFontColor, 1)
      .text(prettifyString(lever.label), options.margin, options.headerHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      .text((leverOption.value), options.margin, options.headerHeight + 112 - 2 + (index * 24), {
        width: options.colWidthTwoCol,
        align: 'right'
      });

    if (index !== levers.length - 1) {
      doc.rect(options.margin, options.headerHeight + 126 + (index * 24), options.colWidthTwoCol, 1)
        .fillColor('#192F35', 0.08)
        .fill();
    }
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
      doc.fillColor(options.secondaryFontColor, 1)
        .font(options.boldFont)
        .text(filter.label, filterLeft, options.headerHeight + 112 - 2 + (index * 44));

      let filterValues = filtersState[filter.id];

      doc.fontSize(8)
        .font(options.baseFont)
        .fillColor(options.baseFontColor);

      if (filter.type === 'range') {
        doc.text(`${filterValues.min} - ${filterValues.max}`, filterLeft, options.headerHeight + 126 - 2 + (index * 44), {
          width: options.colWidthTwoCol,
          align: 'left'
        });
      } else {
        let valueString = filterValues
          .reduce((acc, value) => acc.concat(filter.options.find(f => f.value === value)['label']), [])
          .toString();

        // doc.text(`${valueString}`, options.pageWidth - options.colWidthTwoCol - options.margin, options.headerHeight + 112 - 2 + (index * 24), {
        doc.text(`${valueString}`, filterLeft, options.headerHeight + 126 - 2 + (index * 44), {
          width: options.colWidthTwoCol,
          align: 'left'
        });
      }

      // if (index !== activeFilters.length - 1) {
      //   doc.rect(filterLeft, options.headerHeight + 148 + (index * 36), options.colWidthTwoCol, 1)
      //     .fillColor('#192F35', 0.08)
      //     .fill();
      // }
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
