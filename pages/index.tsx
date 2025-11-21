import { useEffect, useState } from "react";

type Link = {
  id: number;
  code: string;
  url: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
    } else {
      setUrl("");
      setCode("");
      fetchLinks();
    }

    setLoading(false);
  };

  const deleteLink = async (code: string) => {
    await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });
    fetchLinks();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">TinyLink 🔗</h1>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Enter URL (https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Custom code (optional: A-Z, a-z, 0-9, 6-8 chars)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={createLink}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Short Link"}
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-3">Links</h2>
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="bg-white p-3 shadow rounded flex justify-between items-center">
              <div>
                <a
                  href={`/${link.code}`}
                  target="_blank"
                  className="text-blue-600 font-semibold"
                >
                  {link.code}
                </a>
                <p className="text-sm text-gray-600">{link.url}</p>
                <p className="text-xs text-gray-500">
                  Clicks: {link.clicks} | Created: {new Date(link.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                className="text-red-500 text-sm font-semibold"
                onClick={() => deleteLink(link.code)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
