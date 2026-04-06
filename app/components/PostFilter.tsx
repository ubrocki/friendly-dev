interface PostFilterProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const PostFilter = ({ searchQuery, onSearchQueryChange }: PostFilterProps) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-ghray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search posts..."
      />
    </div>
  );
};

export default PostFilter;
