"use client";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/components/LoadingPage';
import AdminSideBar from '@/components/AdminSideBar';

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState(''); // New password state
    const [addAdminError, setAddAdminError] = useState('');

    const [editAdmin, setEditAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || token === 'undefined') {
            router.push('/admin/login');
            return;
        }

        const fetchAdmins = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/admin/manage-admins', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }
                const data = await response.json();
                setAdmins(data);
            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to load admins. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [router]);

    const handleAddAdmin = async () => {
        const token = localStorage.getItem('token');
        const originAdmin = localStorage.getItem('adminEmail'); // assuming admin email is stored locally

        try {
            const response = await fetch('/api/admin/manage-admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newAdminEmail,
                    password: newAdminPassword, // Include password
                    origin: originAdmin, // Include origin of current admin
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add admin.");
            }

            const newAdmin = await response.json();
            setAdmins([...admins, newAdmin]);
            setShowAddAdminModal(false);
            setNewAdminEmail('');
            setNewAdminPassword(''); // Reset password input
            setAddAdminError('');
        } catch (error) {
            console.error("Add admin error:", error);
            setAddAdminError("Failed to add admin. Please try again.");
        }
    };

    const handleEditAdmin = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/admin/manage-admins/${editAdmin.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: editAdmin.email }),
            });

            if (!response.ok) {
                throw new Error("Failed to update admin.");
            }

            setAdmins(admins.map((admin) => (admin.id === editAdmin.id ? editAdmin : admin)));
            setEditAdmin(null);
        } catch (error) {
            console.error("Failed to edit admin:", error);
        }
    };

    const handleEditButtonClick = (admin) => {
        setEditAdmin(admin);
    }

    const handleDeleteAdmin = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/admin/manage-admins/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete admin");
            }

            setAdmins(admins.filter((admin) => admin.id !== id));
        } catch (error) {
            console.error("Failed to delete admin:", error);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (errorMessage) {
        return <div className="text-center text-red-500">{errorMessage}</div>;
    }

    return (
        <>
            <div className="flex">
                <AdminSideBar />
                <div className='container flex flex-col items-center justify-center w-full p-5 bg-white'>
                    <div className="w-full py-3 border-b-2">
                        <h2 className='text-2xl font-medium'>Manage Admins</h2>
                    </div>
                    <div className="flex justify-end w-full">
                        <button onClick={() => setShowAddAdminModal(true)} className='p-2 my-2 bg-yellow-200 rounded text-red-950'>
                            <FontAwesomeIcon icon={faPlus} /> Add Admin
                        </button>
                    </div>

                    {showAddAdminModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                            <div className="p-5 bg-white rounded">
                                <h2 className="text-xl font-medium">Add Admin</h2>
                                <input
                                    type="email"
                                    value={newAdminEmail}
                                    placeholder='Email'
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                    className="w-full p-2 my-2 border rounded"
                                />
                                <input
                                    type="password"
                                    value={newAdminPassword}
                                    placeholder='Password'
                                    onChange={(e) => setNewAdminPassword(e.target.value)}
                                    className="w-full p-2 my-2 border rounded"
                                />
                                <button onClick={handleAddAdmin} className="p-2 mt-2 text-white bg-green-500 rounded">Confirm Add</button>
                                <button onClick={() => setShowAddAdminModal(false)} className="p-2 mt-2 ml-2 text-white bg-red-500 rounded">Cancel</button>
                                {addAdminError && <p className="mt-2 text-red-500">{addAdminError}</p>}
                            </div>
                        </div>
                    )}

                    {admins.length === 0 ? (
                        <p>No admins found.</p>
                    ) : (
                        <table className='w-full p-2 bg-white border-2'>
                            <thead>
                                <tr>
                                    <th className='p-2 border-2'>Email</th>
                                    <th className='p-2 border-2'>Origin</th>
                                    <th className='p-2 border-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className='p-2 border-2'>{admin.email}</td>
                                        <td className='p-2 border-2'>{admin.origin}</td>
                                        <td className='p-2 px-2 m-auto border-2'>
                                            <button
                                                onClick={() => handleEditButtonClick(admin)}
                                                className='px-3 py-1 bg-yellow-200 rounded text-red-950'
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className='p-1 text-yellow-200 rounded bg-red-950'>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
