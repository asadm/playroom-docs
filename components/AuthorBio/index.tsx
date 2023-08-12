import styles from './style.module.css'
import asadImg from './images/asad.jpg';
import tabishImg from './images/tabish.jpg';

enum Author {
  asad = "asad",
  tabish = "tabish",
}

const authors = {
  [Author.asad]: {
    name: "Asad Memon",
    img: asadImg.src,
    twitter: "_asadmemon"
  },
  [Author.tabish]: {
    name: "Tabish Ahmed",
    img: tabishImg.src,
    twitter: "TaabiTweets"
  },
}

export default function AuthorBio({author: Author, date}) {
  const author = authors[Author];

  return (
    <div className={styles.authorBio}>
      <img src={author.img} alt={author.name} />
      <div>
        <b>{author.name} <a target="_blank" href={`https://twitter.com/${author.twitter}`}className={styles.twitterLink}></a></b>
        <p>{date?
          new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }) : ""
          }</p>
      </div>
    </div>
  )
}