export interface IUser {
	id: string;
	username: string;
	profile_picture: string;
	email: string;
}

export interface IPost {
	id: string;
	title: string;
	image: string;
	creator: IUser;
  }
