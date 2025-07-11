export default function PublishDate({ date }) {
  if (!date) return <span className="text-sm text-gray-500">출간일 없음</span>;

  const formatted = new Date(date.replace(/-/g, '/')).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <span className="text-sm text-gray-500">{formatted}</span>;
}
