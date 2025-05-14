export interface SendMailInterface {
    email: string;
    mailName: string;
    subject: string;
    tamplatePath?: string;
    context: {
        password?: string;
    }
}