export interface UserComponent {
    getUserById(id: number): Promise<{
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    } | undefined>;
}
