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
    .text(config.appDescription, options.margin + 20 + 8, options.pageHeight - (options.margin * 1.5) + 12, {
      width: options.column,
      height: 16,
      align: 'left'
    });

  // Right date
  doc.text('© ' + new Date().getFullYear(), options.pageWidth - options.column - options.margin, options.pageHeight - options.margin * 1.5, {
    width: options.column,
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

  const { country, model, scenario } = props;

  // Title
  doc.fontSize(20);
  doc.fillColor(options.baseFontColor)
    // .font(MSSemiBold)
    .text(country.data.name, options.margin, options.margin);

  // Right Title
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor)
    // .font(MSSemiBold)
    .text(config.appTitle, options.pageWidth - options.column - options.margin, options.margin, {
      width: options.column,
      align: 'right'
    });

  // Map Body Base
  doc.rect(0, 80, options.pageWidth, mapHeight)
    .fillColor('#E1E1E1')
    .fill();

  // Map
  doc.image(dataURL, mapMargin, 80, { fit: [options.pageWidth, mapHeight] });

  // Map outline
  doc.rect(0, 80, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc.rect(0, 80 + mapHeight - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Secondary Body Base
  doc.rect(0, 80 + mapHeight, options.pageWidth, options.pageHeight - (80 + mapHeight) - options.margin * 2)
    .fill('#f6f7f7');

  doc.rect(0, options.pageHeight - options.margin * 2 - 1, options.pageWidth, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Indicator Headers
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1)
    // .font(MSSemiBold)
    .text('Scenarios and filters', options.margin, 80 + mapHeight + 20);

  doc.rect(options.margin, 80 + mapHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const lorem = 'The selected scenario and filters.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    // .font(MSLight)
    .text(lorem, options.margin, 80 + mapHeight + 52, {
      width: options.column,
      align: 'left'
    });

  // Result Header
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor)
    // .font(MSSemiBold)
    .text('Results', options.margin + options.column + options.gutter, 80 + mapHeight + 20);

  doc.rect(options.margin + options.column + options.gutter, 80 + mapHeight + 38, 28, 2)
    .fill(options.primaryColor);

  const loremTwo = 'A summary of the results.';
  doc.fontSize(8);
  doc.fillColor(options.baseFontColor)
    // .font(MSLight)
    .text(loremTwo, options.margin + options.column + options.gutter, 80 + mapHeight + 52, {
      width: options.column,
      align: 'left'
    });

  // Levers
  const levers = model.data.levers;
  levers.forEach((lever, index) => {
    // doc.circle(margin + 3, 80 + mapHeight + 112 + 3 + (index * 24), 3)
    //    // .fill(getLayerColor(layer.datasetName))

    doc.fontSize(8);
    doc.fillColor(options.secondaryFontColor, 1)
      // .font(MSLight)
      .text(prettifyString(lever.label), options.margin, 80 + mapHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      // .font(MSSemiBold)
      .text(('Yellow yellow'), options.margin, 80 + mapHeight + 112 - 2 + (index * 24), {
        width: options.column,
        align: 'right'
      });

    if (index !== levers.length - 1) {
      doc.rect(options.margin, 80 + mapHeight + 126 + (index * 24), options.column, 1)
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
      // .font(MSLight)
      .text(output.name, options.margin + options.column + options.gutter, 80 + mapHeight + 112 - 2 + (index * 24));

    doc.fontSize(8);
    doc.fillColor(options.baseFontColor)
      // .font(MSSemiBold)
      .text(output.value, options.pageWidth - options.column - options.margin, 80 + mapHeight + 112 - 2 + (index * 24), {
        width: options.column,
        align: 'right'
      });

    if (index !== outputs.length - 1) {
      doc.rect(options.margin + options.column + options.gutter, 80 + mapHeight + 126 + (index * 24), options.column, 1)
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
    // .font(MSSemiBold)
    .text('About the model', options.margin, 80 + 20);

  doc.rect(options.margin, 80 + 38, 28, 2)
    .fill(options.primaryColor);

  doc.fontSize(10);
  doc.fillColor(options.secondaryFontColor)
    // .font(MSLight)
    .text(model.data.description, options.margin, 80 + 52, {
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
