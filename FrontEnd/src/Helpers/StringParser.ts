export const parseHTMLTotext : (html:string) =>string = (html)=>{
   const doc = new DOMParser().parseFromString(html , "text/html");
   return doc.body.textContent ||""
} 

