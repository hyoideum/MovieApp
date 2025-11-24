export interface Rating {
  id: number;
  value: number;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
  averageRating?: number;
  ratings?: Rating[];
  userRating?: number;
}