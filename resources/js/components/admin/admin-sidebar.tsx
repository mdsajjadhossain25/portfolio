import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    User, 
    FolderKanban, 
    FileText, 
    Briefcase, 
    Mail,
    Inbox,
    ExternalLink,
    Home,
    MessageSquare,
    Tags,
    Folder,
} from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { AdminNavMain } from '@/components/admin/admin-nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';

import AppLogo from '../app-logo';

// Admin navigation structure - modular and extendable
const adminNavGroups: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin',
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Content Management',
        items: [
            {
                title: 'About',
                href: '/admin/about',
                icon: User,
            },
            {
                title: 'Projects',
                href: '/admin/projects',
                icon: FolderKanban,
                items: [
                    {
                        title: 'All Projects',
                        href: '/admin/projects',
                    },
                    {
                        title: 'Project Types',
                        href: '/admin/project-types',
                    },
                ],
            },
            {
                title: 'Blog',
                href: '/admin/blog',
                icon: FileText,
                items: [
                    {
                        title: 'All Posts',
                        href: '/admin/blog/posts',
                    },
                    {
                        title: 'Categories',
                        href: '/admin/blog/categories',
                    },
                    {
                        title: 'Tags',
                        href: '/admin/blog/tags',
                    },
                    {
                        title: 'Comments',
                        href: '/admin/blog/comments',
                    },
                ],
            },
            {
                title: 'Services',
                href: '/admin/services',
                icon: Briefcase,
            },
            {
                title: 'Inbox',
                href: '/admin/inbox',
                icon: Inbox,
            },
        ],
    },
];

const footerNavItems = [
    {
        title: 'View Site',
        href: '/',
        icon: ExternalLink,
    },
    {
        title: 'Go to Home',
        href: '/',
        icon: Home,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {adminNavGroups.map((group) => (
                    <AdminNavMain key={group.title} group={group} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
