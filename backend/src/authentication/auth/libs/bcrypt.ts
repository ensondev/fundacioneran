import * as bcrypt from 'bcrypt';

export const encrypt = async (password: string) => {
    const saltRounds = 10; //Coste del procesamiento
    return await bcrypt.hash(password, saltRounds)
} 

export const compare = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}