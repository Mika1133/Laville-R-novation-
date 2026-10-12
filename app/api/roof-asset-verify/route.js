import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
const images=["0C4EC403-B9EF-4C1E-911F-BBD0656B7A68.png","22BE0CD5-3368-43AD-9F75-395E6C5A1DA7.png","259CE7F5-3D50-4874-B762-A5A84749F2D6.png","3395CEB9-3D59-47D2-A661-8B9BCA9EF415.png","4783C61E-9DB1-4FF6-993C-8787DF50BF9D.png","96F870C2-A056-499F-A6A5-71F0ABE4D28B.png","C6B6841B-0A43-41AA-A15D-4795FE30A9E0.png","E35F7184-85ED-4DD2-AAD8-9EBFB530DFF0.png"];
export const dynamic="force-dynamic";
export async function GET(){
 const items=[];
 for(const file of images){
  const b=await fs.readFile(path.join(process.cwd(),"public/images/toiture/source",file));
  const resized=await sharp(b).resize(180,240,{fit:"inside"}).flatten({background:"#17211d"}).jpeg({quality:60}).toBuffer();
  items.push({file,preview:resized.toString("base64")});
 }
 return Response.json({images:items},{headers:{"Cache-Control":"no-store"}});
}