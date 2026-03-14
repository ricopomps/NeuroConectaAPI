import htmlPdf, { CreateOptions } from "html-pdf";
import moment, { MomentInput } from "moment-timezone";
import ExcelJS from "exceljs";
import _ from "lodash";

export const htmlToPdf = (
  htmlContent: string,
  options: CreateOptions = {},
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const defaultOptions: CreateOptions = {
      format: "A4",
      childProcessOptions: <any>{
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    };
    htmlPdf
      .create(htmlContent, { ...defaultOptions, ...options })
      .toBuffer((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
  });

export const markdownToPdf = async (
  markdownContent: string,
  options: CreateOptions = {},
) => {
  const htmlContent = await markdownToHtml(markdownContent);
  return htmlToPdf(htmlContent, options);
};

export const markdownToHtml = async (
  markdownContent: string,
): Promise<string> => {
  const { marked } = await import("marked");
  return marked.parse(markdownContent);
};

export const formatDate = (
  isoStringLikeDate: MomentInput,
  targetFormat: string,
  timezone?: string,
  locale?: moment.LocaleSpecifier,
): string => {
  const date = locale
    ? moment(isoStringLikeDate).locale(locale)
    : moment(isoStringLikeDate);
  if (timezone) {
    return date.tz(timezone).format(targetFormat);
  } else {
    return date.format(targetFormat);
  }
};

type DeletableEntity = { deletedAt?: Date | null };
export const isNotDeleted = <T extends DeletableEntity>(
  value: T,
): value is T & { deletedAt?: null } => !value.deletedAt;

export const toExcel = (
  data: any[],
  worksheetName?: string,
  reportName?: string,
  hasHeader?: boolean,
  period?: { dateFrom?: Date; dateUntil?: Date },
  otherSheets?: { data: any[]; worksheetName: string }[],
  metadata?: { [key: string]: string | number },
) => {
  const workbook = new ExcelJS.Workbook();
  addSheet(
    workbook,
    data,
    worksheetName,
    reportName,
    hasHeader,
    period,
    metadata,
  );
  otherSheets?.forEach((sheet) =>
    addSheet(workbook, sheet.data, sheet.worksheetName),
  );
  return workbook.xlsx.writeBuffer();
};

const addSheet = (
  workbook: ExcelJS.Workbook,
  data: any[],
  worksheetName?: string,
  reportName?: string,
  hasHeader?: boolean,
  period?: { dateFrom?: Date; dateUntil?: Date },
  metadata?: { [key: string]: string | number },
) => {
  const worksheet = workbook.addWorksheet(worksheetName || "");
  if (data.length) {
    if (hasHeader) {
      const column = Object.keys(data[0]).length;
      let rowIndex = 1;

      const titleInitialPosition = worksheet
        .getRow(rowIndex)
        .getCell(1).address;
      const titleFinalPosition = worksheet
        .getRow(rowIndex)
        .getCell(column).address;
      const title = reportName
        ? `NeuroConecta - ${reportName} - Dados`
        : "NeuroConecta";

      worksheet.getCell(titleInitialPosition).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      worksheet.getRow(rowIndex).font = { bold: true };
      worksheet.getRow(rowIndex).height = 40;
      worksheet.getCell(titleInitialPosition).value = title;
      worksheet.mergeCells(`${titleInitialPosition}:${titleFinalPosition}`);

      if (period) {
        const { dateFrom, dateUntil } = period;
        const formatDate = (date?: Date | string): string =>
          moment(date).tz("America/Recife").format("DD/MM/YYYY");
        const currentDateFormatted = formatDate(new Date());
        let periodString = `Referente ao período de ${formatDate(dateFrom)} a ${formatDate(
          dateUntil,
        )}`;
        if (!dateFrom && dateUntil) {
          periodString = `Referente ao período até ${formatDate(dateUntil)}`;
        }
        if (dateFrom && !dateUntil) {
          periodString = `Referente ao período de ${formatDate(
            dateFrom,
          )} a ${currentDateFormatted}`;
        }
        rowIndex += 1;
        const subtitleInitialForPeriodPosition = worksheet
          .getRow(rowIndex)
          .getCell(1).address;
        const subtitleFinalForPeriodPosition = worksheet
          .getRow(rowIndex)
          .getCell(column).address;

        worksheet.getCell(subtitleInitialForPeriodPosition).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        worksheet.getRow(rowIndex).height = 25;
        worksheet.getCell(subtitleInitialForPeriodPosition).value =
          periodString;

        worksheet.mergeCells(
          `${subtitleInitialForPeriodPosition}:${subtitleFinalForPeriodPosition}`,
        );
      }

      if (metadata && Object.keys(metadata).length > 0) {
        rowIndex += 1;
        const metadataInitialPosition = worksheet
          .getRow(rowIndex)
          .getCell(1).address;
        const metadataFinalPosition = worksheet
          .getRow(rowIndex)
          .getCell(column).address;
        const metadataString = Object.entries(metadata)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ");

        worksheet.getCell(metadataInitialPosition).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        worksheet.getRow(rowIndex).height = 25;
        worksheet.getCell(metadataInitialPosition).value = metadataString;
        worksheet.mergeCells(
          `${metadataInitialPosition}:${metadataFinalPosition}`,
        );
      }

      rowIndex += 1;
      const subtitleInitialPosition = worksheet
        .getRow(rowIndex)
        .getCell(1).address;
      const subtitleFinalPosition = worksheet
        .getRow(rowIndex)
        .getCell(column).address;

      worksheet.getCell(subtitleInitialPosition).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      worksheet.getRow(rowIndex).height = 25;
      worksheet.getCell(subtitleInitialPosition).value = `Extraído em ${moment()
        .utcOffset("-0300")
        .format("DD/MM/YYYY HH:mm")}`;
      worksheet.mergeCells(
        `${subtitleInitialPosition}:${subtitleFinalPosition}`,
      );
    }

    let initialRow = 1;

    if (hasHeader) {
      const hasMetadata = metadata && Object.keys(metadata).length > 0;
      const hasMetadataAndPeriod = hasMetadata ? 6 : 5;
      const hasMetadataButNoPeriod = hasMetadata ? 5 : 4;
      initialRow = period ? hasMetadataAndPeriod : hasMetadataButNoPeriod;
    }

    worksheet.getRow(initialRow).values = Object.keys(data[0]);

    worksheet.columns = Object.keys(data[0]).map((key) => ({ key }));

    worksheet.getRow(initialRow).eachCell((cell) => {
      cell.style.font = { bold: true };
      cell.style.alignment = { vertical: "middle", horizontal: "center" };
      cell.style.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    data.forEach((row) => worksheet.addRow(row));
    autoWidth(worksheet);
  }

  return worksheet;
};

const autoWidth = (worksheet: ExcelJS.Worksheet, minimalWidth = 30) => {
  worksheet.columns.forEach((column, index) => {
    let maxColumnLength = 0;
    worksheet.getColumn(index + 1).eachCell({ includeEmpty: true }, (cell) => {
      maxColumnLength = Math.max(
        maxColumnLength,
        minimalWidth,
        cell.value ? cell.value.toString().length : 0,
      );
    });
    column.width = maxColumnLength + 2;
  });
};
