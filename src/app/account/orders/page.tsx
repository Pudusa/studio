import Image from 'next/image';
import { orders } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground">View your order history and status.</p>
            </div>
        </div>
        
        {orders.length > 0 ? (
            <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                    <CardTitle>Order {order.id}</CardTitle>
                    <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {order.items.map((item) => {
                        const image = PlaceHolderImages.find(i => i.id === item.image);
                        return (
                        <div key={item.id} className="flex items-center gap-4">
                            {image && <Image src={image.imageUrl} alt={item.name} width={64} height={64} className="rounded-md" />}
                            <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        );
                    })}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-end gap-2">
                    <Separator />
                    <p className="font-semibold">Total: {formatPrice(order.total)}</p>
                    <div className="flex gap-2">
                        <Button variant="outline">View Details</Button>
                        <Button>Track Order</Button>
                    </div>
                </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
            <Card>
            <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </CardContent>
            </Card>
        )}
    </div>
  );
}
