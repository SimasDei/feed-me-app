export default class Likes {
  constructor() {
    this.likes = [];
  }
  addLike(id, title, author, image) {
    const like = { id, title, author, image };
    this.likes.push(like);
    return like;
  }
  deleteLike(id) {
    const index = this.likes.findIndex(element => element.id === id);
    this.likes.splice(index, 1);
  }
  isLiked(id) {
    return this.likes.findIndex(element => element.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }
}
