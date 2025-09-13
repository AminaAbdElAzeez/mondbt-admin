// import React, { ReactNode } from "react";
// function processFuncArray(Component, funcs, callback) {
//   let index = 0;
//   // debugger
//   function next(Comp: any) {
//     index++;
//     if (index < funcs.length) {
//       return funcs[index](Component, next);
//     } else {
//       return callback(Comp);
//     }
//   }
//   return funcs[index](Component, next);
// }

// export default function Middleware(Component, arrs) {
//   // console.log("component name")
//   const newComponent = {
//     [Component.name]: (props) => {
//       const Data = processFuncArray(Component, arrs, (C) => C);
//       const Placeholder = () => (
//         <h1>You should return component or next function</h1>
//       );
//       return Data ? <Data {...props} /> : <Placeholder />;
//     },
//   };
//   return newComponent[Component.name];
// }
// utlis/navigation/mw.tsx
// mw.tsx
export default function middleware(Component: any, middlewares: any[]) {
  return function WrappedComponent(props: any) {
    let Comp: any = (p: any) => <Component {...p} />;

    for (const mw of middlewares) {
      const PrevComp = Comp;

      // كل Middleware بيشتغل على الـ Component السابق
      Comp = (p: any) => {
        return mw(
          PrevComp,
          (NextComp: any) => <NextComp {...p} />
        )(p);
      };
    }

    return <Comp {...props} />;
  };
}
