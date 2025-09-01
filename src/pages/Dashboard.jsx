import Header from "../components/Header/Header";
import CategoryBar from "../components/Header/CategoryBar";
import SearchBar from "../components/Header/SearchBar";
import TodoList from "../components/Todo/TodoList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 overflow-auto scrollbar-hide">
      <Header />
      <CategoryBar />
      <SearchBar />
      <TodoList />
    </div>
  );
}
