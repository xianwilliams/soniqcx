import {Children,Fragment,isValidElement,type ReactNode,type HTMLAttributes} from 'react';
function flatten(children:ReactNode):ReactNode[]{return Children.toArray(children).flatMap(child=>isValidElement<{children?:ReactNode}>(child)&&child.type===Fragment?flatten(child.props.children):[child])}
export default function ToneHeading({as:Tag='h2',children,className='',...props}:HTMLAttributes<HTMLHeadingElement>&{as?:'h1'|'h2'}){
 const nodes=flatten(children);let content:ReactNode=children;
 if(!nodes.some(n=>isValidElement(n)&&n.type==='span')){
  const br=nodes.findLastIndex(n=>isValidElement(n)&&n.type==='br');
  if(br>=0)content=<>{nodes.slice(0,br+1)}<span className="tone-accent">{nodes.slice(br+1)}</span></>;
  else if(nodes.length===1&&typeof nodes[0]==='string'){
   const text=nodes[0],sentence=text.match(/^(.+?[.!?])\s+(.+)$/);
   const words=text.split(' '),cut=Math.ceil(words.length*.5);
   content=sentence?<>{sentence[1]} <span className="tone-accent">{sentence[2]}</span></>:words.length>2?<>{words.slice(0,cut).join(' ')} <span className="tone-accent">{words.slice(cut).join(' ')}</span></>:children;
  }
 }
 return <Tag {...props} className={`tone-heading ${className}`}>{content}</Tag>;
}
