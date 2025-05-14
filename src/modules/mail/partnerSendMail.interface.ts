export interface SendPartnerInterface {
    email: string;
    mailName: string;
    subject: string;
    tamplatePath?: string;
    context: {
        password?: string;
    }
}