import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft,
    Mail,
    MailOpen,
    Reply,
    Trash2,
    CheckCircle,
    Circle,
    Clock,
    Globe,
    User,
    ExternalLink,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    is_replied: boolean;
    ip_address: string | null;
    user_agent: string | null;
    formatted_date: string;
    created_at: string;
}

interface Props {
    message: Message;
}

export default function InboxShow({ message }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Inbox', href: '/admin/inbox' },
        { title: message.subject.substring(0, 30) + (message.subject.length > 30 ? '...' : ''), href: `/admin/inbox/${message.id}` },
    ];

    const handleToggleRead = () => {
        router.post(`/admin/inbox/${message.id}/toggle-read`);
    };

    const handleToggleReplied = () => {
        router.post(`/admin/inbox/${message.id}/toggle-replied`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(`/admin/inbox/${message.id}`);
        }
    };

    const handleReply = () => {
        // Open email client with pre-filled data
        const subject = encodeURIComponent(`Re: ${message.subject}`);
        const body = encodeURIComponent(`\n\n---\nOriginal Message:\nFrom: ${message.name} <${message.email}>\nDate: ${message.created_at}\nSubject: ${message.subject}\n\n${message.message}`);
        window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, '_blank');
        
        // Mark as replied
        if (!message.is_replied) {
            router.post(`/admin/inbox/${message.id}/mark-replied`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message: ${message.subject}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/inbox">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Inbox
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleToggleRead}>
                            {message.is_read ? (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark Unread
                                </>
                            ) : (
                                <>
                                    <MailOpen className="mr-2 h-4 w-4" />
                                    Mark Read
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleToggleReplied}>
                            {message.is_replied ? (
                                <>
                                    <Circle className="mr-2 h-4 w-4" />
                                    Mark Unreplied
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark Replied
                                </>
                            )}
                        </Button>
                        <Button variant="default" size="sm" onClick={handleReply}>
                            <Reply className="mr-2 h-4 w-4" />
                            Reply
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Message Card */}
                <div className="flex-1 rounded-xl border bg-card overflow-hidden">
                    {/* Message header */}
                    <div className="border-b bg-muted/30 p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold">{message.subject}</h1>
                                {!message.is_read && (
                                    <Badge variant="default" className="bg-cyan-500">
                                        Unread
                                    </Badge>
                                )}
                                {message.is_replied && (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                                        <Reply className="mr-1 h-3 w-3" />
                                        Replied
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-semibold">
                                        {message.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium">{message.name}</div>
                                        <a 
                                            href={`mailto:${message.email}`} 
                                            className="text-sm text-cyan-600 hover:underline flex items-center gap-1"
                                        >
                                            {message.email}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {message.created_at}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Message body */}
                    <div className="p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                {message.message}
                            </div>
                        </div>
                    </div>

                    {/* Message metadata */}
                    {(message.ip_address || message.user_agent) && (
                        <>
                            <Separator />
                            <div className="p-6 bg-muted/30">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                    Technical Details
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {message.ip_address && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">IP Address:</span>
                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                                {message.ip_address}
                                            </span>
                                        </div>
                                    )}
                                    {message.user_agent && (
                                        <div className="flex items-start gap-2 text-sm col-span-2">
                                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <span className="text-muted-foreground">User Agent:</span>
                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                                                {message.user_agent}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick actions footer */}
                <div className="flex items-center justify-between rounded-xl border bg-card p-4">
                    <Link href="/admin/inbox">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Inbox
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="default" onClick={handleReply}>
                            <Reply className="mr-2 h-4 w-4" />
                            Reply to {message.name}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
