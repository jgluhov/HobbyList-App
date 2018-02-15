/**
 * HobbyForm | Hobby Model
 */
import { uuid } from '@utils';

export enum Belonging {
    OWN = 'own',
    FRIEND = 'friend'
}

export class Hobby {
    public id: string = uuid();
    public text: string;
    public belonging: string;
    public createdAt: Date;

    constructor(text: string, belonging: string = Belonging.OWN) {
        this.text = text;
        this.belonging = belonging;
        this.createdAt = new Date();
    }
}
