import htmlPdf, { CreateOptions } from "html-pdf";

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
