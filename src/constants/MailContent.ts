export interface IMailContent {
    from?: string;
    to?: string;
    subject?: string;
    html?: string;
}

const MailContent: IMailContent = {
  from: "<foo@example.com>",
  to: "",
  subject: "",
  html: "",
};

export default MailContent;
