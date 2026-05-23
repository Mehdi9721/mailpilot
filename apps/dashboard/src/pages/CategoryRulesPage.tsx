import { useEffect, useState } from 'react';
import apiClient from '../api/client/api-client';

interface CategoryRule {
  id: string;
  category: string;
  autoReplyEnabled: boolean;
  replyTone: string;
  replyStyle?: string;
  allowedDomains: string[];
  blockedDomains: string[];
}

export default function CategoryRulesPage() {
  const [rules, setRules] = useState<CategoryRule[]>([]);

  const [form, setForm] = useState<Partial<CategoryRule>>({
    category: '',
    autoReplyEnabled: false,
    replyTone: '',
    replyStyle: '',
    allowedDomains: [],
    blockedDomains: []
  });

  // Load rules
  const fetchRules = async () => {
    try {
      const res = await apiClient.get('/category-rules');
      if (res.data.success) {
        setRules(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Save rule (create or update)
  const saveRule = async () => {
    try {
      if (form.id) {
        await apiClient.put(
          `/category-rules/${form.id}`,
          form
        );
      } else {
        await apiClient.post(
          '/category-rules',
          form
        );
      }

      // reset form
      setForm({
        category: '',
        autoReplyEnabled: false,
        replyTone: '',
        replyStyle: '',
        allowedDomains: [],
        blockedDomains: []
      });

      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete rule
  const deleteRule = async (id: string) => {
    try {
      await apiClient.delete(
        `/category-rules/${id}`
      );
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Category Rules
      </h1>

      {/* FORM */}
      <div className="bg-gray-100 p-4 rounded mb-6">

        {/* Category */}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Category"
          value={form.category || ''}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value
            })
          }
        />

        {/* Auto Reply Toggle */}
        <label className="flex items-center gap-2 mb-3 text-sm">
          <input
            type="checkbox"
            checked={form.autoReplyEnabled || false}
            onChange={(e) =>
              setForm({
                ...form,
                autoReplyEnabled:
                  e.target.checked
              })
            }
          />
          Auto Reply Enabled
        </label>

        {/* Tone */}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Reply Tone"
          value={form.replyTone || ''}
          onChange={(e) =>
            setForm({
              ...form,
              replyTone: e.target.value
            })
          }
        />

        {/* Style */}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Reply Style"
          value={form.replyStyle || ''}
          onChange={(e) =>
            setForm({
              ...form,
              replyStyle: e.target.value
            })
          }
        />

        {/* Allowed Domains */}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Allowed Domains (comma separated)"
          value={
            form.allowedDomains?.join(',') || ''
          }
          onChange={(e) =>
            setForm({
              ...form,
              allowedDomains: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            })
          }
        />

        {/* Blocked Domains */}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Blocked Domains (comma separated)"
          value={
            form.blockedDomains?.join(',') || ''
          }
          onChange={(e) =>
            setForm({
              ...form,
              blockedDomains: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            })
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={saveRule}
        >
          {form.id ? 'Update Rule' : 'Save Rule'}
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Category</th>
            <th className="border p-2">Auto Reply</th>
            <th className="border p-2">Tone</th>
            <th className="border p-2">Style</th>
            <th className="border p-2">Allowed</th>
            <th className="border p-2">Blocked</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-gray-200 border border-black">
          {rules.map((rule) => (
            <tr key={rule.id} className="text-center border border-black">
              <td className="border p-2">
                {rule.category}
              </td>

              <td className="border p-2">
                {rule.autoReplyEnabled
                  ? 'Yes'
                  : 'No'}
              </td>

              <td className="border p-2">
                {rule.replyTone}
              </td>

              <td className="border p-2">
                {rule.replyStyle || '-'}
              </td>

              <td className="border p-2">
                {rule.allowedDomains.join(', ')}
              </td>

              <td className="border p-2">
                {rule.blockedDomains.join(', ')}
              </td>

              <td className="border p-2 space-x-2">
                <button
                  className="bg-green-500 px-2 py-1 rounded"
                  onClick={() =>
                    setForm({
                      id: rule.id,
                      category: rule.category,
                      autoReplyEnabled:
                        rule.autoReplyEnabled,
                      replyTone: rule.replyTone,
                      replyStyle:
                        rule.replyStyle,
                      allowedDomains:
                        rule.allowedDomains,
                      blockedDomains:
                        rule.blockedDomains
                    })
                  }
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 px-2 py-1 rounded"
                  onClick={() =>
                    deleteRule(rule.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}