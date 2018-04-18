export class User {
    FullName:string;
    IdentificationNumber:string;
    UserName :string;
    Password :string;
    BirthDate :Date;
    IsFemale :boolean;
    Email :string;
    UserPhoto:string;
    token: string;
    Role:string;

    public static getAnonymousUser():User
    {
        let user = new User();
        user.FullName="visitor";
        user.IsFemale=true;
        return user;
    }
}
