import { Head, Link, router } from '@inertiajs/react';
import { 
    Inbox, 
    Search, 
    Mail,
    MailOpen,
    Reply,
    Trash2,
    CheckCircle,
    Circle,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type BreadcrumbItem } from '@/types';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    preview: string;
    is_read: boolean;
    is_replied: boolean;
    formatted_date: string;
    created_at: string;
}

interface PaginatedMessages {
    data: Message[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    messages: PaginatedMessages;
    filters: {
        status?: string;
        search?: string;
    };
    counts: {
        all: number;
        unread: number;
        read: number;
        replied: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Inbox', href: '/admin/inbox' },
];

const statusFilters = [
    { value: '', label: 'All Messages', icon: Mail },
    { value: 'unread', label: 'Unread', icon: Circle },
    { value: 'read', label: 'Read', icon: MailOpen },
    { value: 'replied', label: 'Replied', icon: Reply },
];

export default function InboxIndex({ messages, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeFilter, setActiveFilter] = useState(filters.status || '');

    const handleFilter = (status: string) => {
        setActiveFilter(status);
        router.get('/admin/inbox', {
            search: search || undefined,
            status: status || undefined,
        }, { preserveState: true });
    };

    const handleSearch = () => {
        router.get('/admin/inbox', {
            search: search || undefined,
            status: activeFilter || undefined,
        }, { preserveState: true });
    };

    const handleRefresh = () => {
        router.reload();
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(i => i !== id) 
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === messages.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.data.map(m => m.id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} message(s)?`)) {
            router.post('/admin/inbox/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    const handleBulkMarkRead = () => {
        if (selectedIds.length === 0) return;
        router.post('/admin/inbox/bulk-mark-read', { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleBulkMarkUnread = () => {
        if (selectedIds.length === 0) return;
        router.post('/admin/inbox/bulk-mark-unread', { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleDelete = (message: Message, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Delete message from "${message.name}"?`)) {
            router.delete(`/admin/inbox/${message.id}`);
        }
    };

    const handleToggleRead = (message: Message, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/admin/inbox/${message.id}/toggle-read`);
    };

    const handleToggleReplied = (message: Message, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/admin/inbox/${message.id}/toggle-replied`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                            <Inbox className="h-6 w-6 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Inbox</h1>
                            <p className="text-muted-foreground">
                                {counts.all} messages • {counts.unread} unread
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleRefresh}>
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Status filters */}
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    variant={activeFilter === filter.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilter(filter.value)}
                                    className="gap-2"
                                >
                                    <filter.icon className="h-4 w-4" />
                                    {filter.label}
                                    {filter.value === '' && (
                                        <Badge variant="secondary" className="ml-1">
                                            {counts.all}
                                        </Badge>
                                    )}
                                    {filter.value === 'unread' && counts.unread > 0 && (
                                        <Badge variant="destructive" className="ml-1">
                                            {counts.unread}
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </div>
                        
                        {/* Search */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search messages..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-64 pl-9"
                                />
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Bulk actions */}
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 border-t pt-4">
                            <span className="text-sm text-muted-foreground">
                                {selectedIds.length} selected
                            </span>
                            <Button variant="outline" size="sm" onClick={handleBulkMarkRead}>
                                <MailOpen className="mr-2 h-4 w-4" />
                                Mark Read
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleBulkMarkUnread}>
                                <Mail className="mr-2 h-4 w-4" />
                                Mark Unread
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Messages List */}
                <div className="flex-1 rounded-xl border bg-card overflow-hidden">
                    {/* List header */}
                    <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3">
                        <Checkbox
                            checked={messages.data.length > 0 && selectedIds.length === messages.data.length}
                            onCheckedChange={toggleSelectAll}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                            {messages.data.length > 0 
                                ? `Showing ${messages.data.length} of ${messages.total} messages`
                                : 'No messages'
                            }
                        </span>
                    </div>

                    {/* Messages */}
                    {messages.data.length > 0 ? (
                        <div className="divide-y">
                            {messages.data.map((message) => (
                                <Link
                                    key={message.id}
                                    href={`/admin/inbox/${message.id}`}
                                    className={`flex items-start gap-4 px-4 py-4 transition-colors hover:bg-muted/50 ${
                                        !message.is_read ? 'bg-cyan-500/5' : ''
                                    }`}
                                >
                                    <div className="flex items-center" onClick={(e) => e.preventDefault()}>
                                        <Checkbox
                                            checked={selectedIds.includes(message.id)}
                                            onCheckedChange={() => toggleSelect(message.id)}
                                        />
                                    </div>
                                    
                                    {/* Unread indicator */}
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                                        {!message.is_read ? (
                                            <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                                        ) : message.is_replied ? (
                                            <Reply className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    
                                    {/* Message content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {message.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                &lt;{message.email}&gt;
                                            </span>
                                        </div>
                                        <div className={`text-sm ${!message.is_read ? 'font-medium' : ''}`}>
                                            {message.subject}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {message.preview}
                                        </p>
                                    </div>
                                    
                                    {/* Date & Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {message.formatted_date}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => handleToggleRead(message, e as unknown as React.MouseEvent)}>
                                                    {message.is_read ? (
                                                        <>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Mark as Unread
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MailOpen className="mr-2 h-4 w-4" />
                                                            Mark as Read
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleToggleReplied(message, e as unknown as React.MouseEvent)}>
                                                    {message.is_replied ? (
                                                        <>
                                                            <Circle className="mr-2 h-4 w-4" />
                                                            Mark as Unreplied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Replied
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={(e) => handleDelete(message, e as unknown as React.MouseEvent)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <Inbox className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No messages</h3>
                            <p className="text-muted-foreground">
                                {filters.status || filters.search 
                                    ? 'No messages match your filters.'
                                    : 'Messages from your contact form will appear here.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {messages.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Page {messages.current_page} of {messages.last_page}
                            </span>
                            <div className="flex items-center gap-2">
                                {messages.links.map((link, index) => {
                                    if (index === 0) {
                                        return (
                                            <Button
                                                key="prev"
                                                variant="outline"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                        );
                                    }
                                    if (index === messages.links.length - 1) {
                                        return (
                                            <Button
                                                key="next"
                                                variant="outline"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
