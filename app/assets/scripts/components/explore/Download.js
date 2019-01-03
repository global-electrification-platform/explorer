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
      width: options.column,
      height: 16,
      align: 'left',
      link: config.baseUrl
    });

  // Left Subtitle
  doc.fillColor(options.secondaryFontColor)
    .font(options.baseFont)
    .text(config.baseUrl, options.margin + 20 + 8, options.pageHeight - (options.margin * 1.5) + 12, {
      width: options.column,
      height: 16,
      align: 'left'
    });

  // Right license
  doc.text('Creative Commons BY 4.0', options.pageWidth - options.column - options.margin, options.pageHeight - options.margin * 1.5, {
    width: options.column,
    height: 16,
    align: 'right',
    link: 'https://creativecommons.org/licenses/by/4.0/'
  });

  // Right date
  doc.text(new Date().getFullYear(), options.pageWidth - options.column - options.margin, options.pageHeight - options.margin * 1.5 + 12, {
    width: options.column,
    height: 16,
    align: 'right',
  });
}

export function downloadPDF (props) {
  console.log(props)
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
    column: 252,
    gutter: 28,
    margin: 40
  };

  // Limit map height to 344px. Which is roughly 16:9 with a 612 options.pageWidth
  const mapHeight = options.pageWidth * aspectRatio > 344 ? 344 : options.pageWidth * aspectRatio;
  const mapWidth = mapHeight / aspectRatio;
  const mapMargin = mapWidth === options.pageWidth ? 0 : (options.pageWidth - mapWidth) / 2;

  const { country, model, scenario, leversState, filtersState } = props;

  // HEADER

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
    .text(config.appTitle, options.pageWidth - options.column - options.margin, options.margin, {
      width: options.column,
      align: 'right'
    });

  // Right Subtitle
  doc.fillColor(options.secondaryFontColor)
    .fontSize(8)
    .text(config.appDescription, options.pageWidth - options.column - options.margin, options.margin + 16, {
      width: options.column,
      height: 16,
      align: 'right'
    });

  // Map Body Base
  doc.rect(0, options.headerHeight, options.pageWidth, mapHeight)
    .fillColor('#E1E1E1')
    .fill();

  // Map
  doc.image(dataURL, mapMargin, options.headerHeight, { fit: [options.pageWidth, mapHeight] });

  // Map outline
  doc.rect(0, options.headerHeight, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc.rect(0, options.headerHeight + mapHeight - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Secondary Body Base
  doc.rect(0, options.headerHeight + mapHeight, options.pageWidth, options.pageHeight - (options.headerHeight + mapHeight) - options.margin * 2)
    .fill('#f6f7f7');

  doc.rect(0, options.pageHeight - options.margin * 2 - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Indicator Headers
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1)
    .text('Scenarios', options.margin, options.headerHeight + mapHeight + 20);

  doc.rect(options.margin, options.headerHeight + mapHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const lorem = 'These results were generated based on the following assumptions.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    .text(lorem, options.margin, options.headerHeight + mapHeight + 52, {
      width: options.column,
      align: 'left'
    });

  // Result Header
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor)
    .text('Results', options.margin + options.column + options.gutter, options.headerHeight + mapHeight + 20);

  doc.rect(options.margin + options.column + options.gutter, options.headerHeight + mapHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const loremTwo = 'A summary of the results.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    .text(loremTwo, options.margin + options.column + options.gutter, options.headerHeight + mapHeight + 52, {
      width: options.column,
      align: 'left'
    });

  // Levers
  const levers = model.data.levers;
  levers.forEach((lever, index) => {
    let leverOption = lever.options.find(o => o.id === leversState[index])

    doc.fontSize(8);
    doc.fillColor(options.secondaryFontColor, 1)
      .text(prettifyString(lever.label), options.margin, options.headerHeight + mapHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      .text((leverOption.value), options.margin, options.headerHeight + mapHeight + 112 - 2 + (index * 24), {
        width: options.column,
        align: 'right'
      });

    if (index !== levers.length - 1) {
      doc.rect(options.margin, options.headerHeight + mapHeight + 126 + (index * 24), options.column, 1)
        .fillColor('#192F35', 0.08)
        .fill();
    }
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
      .text(output.name, options.margin + options.column + options.gutter, options.headerHeight + mapHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      .text(output.value, options.pageWidth - options.column - options.margin, options.headerHeight + mapHeight + 112 - 2 + (index * 24), {
        width: options.column,
        align: 'right'
      });

    if (index !== outputs.length - 1) {
      doc.rect(options.margin + options.column + options.gutter, options.headerHeight + mapHeight + 126 + (index * 24), options.column, 1)
        .fillColor('#192F35', 0.08)
        .fill();
    }
  });

  drawFooter(doc, options);

  // Second page
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
      // width: options.column,
      align: 'left'
    });

  drawFooter(doc, options);

  doc.end();
  stream.on('finish', () => {
    saveAs(stream.toBlob('application/pdf'), `gep-${scenario.data.id}.pdf`);
  });
}

export default downloadPDF;
