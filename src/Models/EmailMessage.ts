export class EmailMessage {
    constructor(
       public id: number,
       public from: string,
        public subject: string,
       public body: string,
        public date: string,
        public isRead: boolean
    ) { }
}