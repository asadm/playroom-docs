import { Card, Cards } from 'nextra-theme-docs'
import list from "../pages/blog/_meta.json";
import styles from './blogIndex.module.css'

export default function BlogIndex() {
  return (

<Cards num={1}>
  {Object.keys(list).map((key) => {
    const { title, image, date } = list[key];
    const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }):"";
    return (
      <Card
        icon={<img src={image} style={{width: "80px"}}></img>}
        style={{border:"1px solid #8D6BED"}}
        // className="blog-card"
        key={key}
        // @ts-ignore
        title={<div><h3 style={{fontSize: "1.5rem"}}>{title}</h3>{formattedDate}</div>}
        // description={}
        href={`/blog/${key}`}
      >
        
      </Card>
    );
  })}
</Cards>
  )
}

export function BlogLatestCard() {
  const latest = list[Object.keys(list)[0]];

  return (
    <div className={styles.floatingContainer}>
      <a href={`/blog/${Object.keys(list)[0]}`} className={styles.floating}><b>New Post: </b>{latest.title} <span>→</span></a>
    </div>
  )
  return (
  <Cards num={1}>
    <Card
      icon={<img src={latest.image} style={{width: "80px"}}></img>}
      style={{border:"1px solid #8D6BED"}}
      // className="blog-card"
      key={Object.keys(list)[0]}
      // @ts-ignore
      title={<div><h3 style={{fontSize: "1.5rem"}}>{latest.title}</h3>{new Date(latest.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</div>}
      // description={}
      href={`/blog/${Object.keys(list)[0]}`}
    >
      
    </Card>
</Cards>
  )
}