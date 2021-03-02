


export const shrink = (len: number, title: string, shortTitle?: string) :string => {
  if ((shortTitle !== undefined) && (shortTitle !== null)){
    title = shortTitle;
  }
  if (title.length > len){
    return title.substr(0,len - 4) + ' ...';
  }
  return title;
}
