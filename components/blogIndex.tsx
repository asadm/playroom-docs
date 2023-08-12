import { Card, Cards } from 'nextra-theme-docs'
import list from "../pages/blog/_meta.json";

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