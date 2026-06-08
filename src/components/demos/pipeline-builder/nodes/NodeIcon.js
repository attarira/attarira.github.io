"use client";
const iconPaths = {
  input: (
    <>
      <path d="M4 12h12" />
      <path d="m12 8 4 4-4 4" />
      <path d="M20 5v14" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
      <path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" />
    </>
  ),
  output: (
    <>
      <path d="M4 5v14" />
      <path d="M8 12h12" />
      <path d="m16 8 4 4-4 4" />
    </>
  ),
  text: (
    <>
      <path d="M4 6h16" />
      <path d="M9 6v12" />
      <path d="M15 6v12" />
      <path d="M7 18h10" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M8 15h.01" />
      <path d="M12 15h.01" />
      <path d="M16 15h.01" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />
    </>
  ),
  transform: (
    <>
      <path d="M4 7h10" />
      <path d="m11 4 3 3-3 3" />
      <path d="M20 17H10" />
      <path d="m13 14-3 3 3 3" />
    </>
  ),
  api: (
    <>
      <path d="M8 9H6a3 3 0 0 0 0 6h2" />
      <path d="M16 9h2a3 3 0 0 1 0 6h-2" />
      <path d="M9 12h6" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M8 7c3 1 4 3 4 9" />
      <path d="M16 7c-3 1-4 3-4 9" />
    </>
  ),
};

export const NodeIcon = ({ name, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {iconPaths[name] ?? iconPaths.input}
  </svg>
);
