const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const dataFile = path.resolve(__dirname, "./data.yml");
const { labels, vendors } = YAML.parse(fs.readFileSync(dataFile, "utf-8"));

const hardwareVendors = vendors.filter(
  (vendor) => vendor.categories.indexOf("hardware") !== -1
);

const softwareVendors = vendors.filter(
  (vendor) => vendor.categories.indexOf("software") !== -1
);

const vendorsByMetric = {};
hardwareVendors.forEach((vendor) => {
  Object.keys(vendor.sensors).forEach((metric) => {
    const link = vendor.sensors[metric];
    if (!vendorsByMetric[metric]) vendorsByMetric[metric] = [];
    vendorsByMetric[metric].push(`- [${vendor.name}](${link})`);
  });
});

const template = `# Aquaponic Technology [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Aquaponics is the sustainable and regenerative next-gen soil-less farming method that uses fish to grow plants.  This is a collection of valuable resources for making your own IoT aquaponic monitoring system.

## Contents

- [Software Suppliers](#software-suppliers)
- [Hardware Suppliers](#hardware-suppliers)
- [Sensors](#sensors)

## Software Suppliers

${softwareVendors
  .map((vendor) => {
    return `- [${vendor.name}](${vendor.website}) ${
      vendor.description || ""
    }\n`;
  })
  .sort()
  .join("")
  .trim()}

## Hardware Suppliers

${hardwareVendors
  .map((vendor) => {
    return `- [${vendor.name}](${vendor.website}) ${
      vendor.description || ""
    }\n`;
  })
  .sort()
  .join("")
  .trim()}

## Sensors

Sensors have a wide range of quality, accuracy and durability.  Depending on your budget and goals you will need to choose your sensors wisely.

${Object.keys(vendorsByMetric)
  .map((metric) => {
    const list = vendorsByMetric[metric].sort().join("\n");
    return `\n\n#### ${labels[metric]}\n\n${list}`;
  })
  .sort()
  .join("")
  .trim()}

## Contribute

Contributions welcome! Read the [contribution guidelines](contributing.md) first.
`;

fs.writeFileSync("readme.md", template);
