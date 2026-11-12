# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

1. new folder constants chứa DEFAULT_DATA
   const DEFAULT_DATA = [{
   id: 1,
   type: "todo",
   title: "To do",
   tasks: [
   { id: 1, title: "Task1", description: "Des task 1" },
   { id: 2, title: "Task2", description: "Des task 2" },
   { id: 3, title: "Task3", description: "Des task 3" },
   ],},
2. bỏ localstoragegroup - done
3. chuyển hoàn toàn sang tailwind - done
4. chuyển logic+ code từ app.jsx sang pages(app.jsx chỉ import) - done
5. chưa có xóa group - delete bên trên xóa theo từ phải qua trái không chose được , delete ở task-group có chose (\*)
6. tách các task không để dính nhau khi chung 1 cột - done
7. add-responsive
   flex-1
   flex flex-col mobile 1 cột (dưới 768px)
   md:grid md:grid-cols-2 ipab 2 cột (từ 768px- 1280px)
   xl:grid-cols-3 desktop 3 cột (từ 1280px)
   gap-4 lg:gap-5 space
   p-3 sm:p-4 lg:p-6 padding
   items-start
   overflow-x-hidden bỏ cuộn ngang
8. use hook form + zod - done
