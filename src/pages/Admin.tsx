import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8000';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbCheckResult, setDbCheckResult] = useState<any>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Check if user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('elitecars_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch database stats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Failed to fetch rides');
      
      const data = await response.json();
      setRides(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch rides",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDatabaseConsistency = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/check-db`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Failed to check database');
      
      const data = await response.json();
      setDbCheckResult(data);
      
      toast({
        title: "Database Check Complete",
        description: "Database consistency check completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to check database consistency",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Database Admin</h1>
        <p className="text-muted-foreground">Inspect and manage your MongoDB data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.users || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rides</CardTitle>
            <CardDescription>Total rides created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.rides || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Total bookings made</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.bookings || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Information</CardTitle>
          <CardDescription>Connection and database details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Database Name</p>
              <p className="text-lg">{stats?.databaseName || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Connection State</p>
              <Badge variant={stats?.connectionState === 1 ? "success" : "destructive"}>
                {stats?.connectionState === 1 ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
          
          <Button 
            className="mt-4" 
            onClick={checkDatabaseConsistency}
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Database Consistency"}
          </Button>
          
          {dbCheckResult && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="font-medium">Check Result:</p>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {JSON.stringify(dbCheckResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" onClick={fetchUsers}>Users</TabsTrigger>
          <TabsTrigger value="rides" onClick={fetchRides}>Rides</TabsTrigger>
          <TabsTrigger value="bookings" onClick={fetchBookings}>Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? "default" : user.role === 'driver' ? "secondary" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), 'PPP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found in the database.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rides">
          {loading ? (
            <div className="text-center py-8">Loading rides...</div>
          ) : rides.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.map(ride => (
                    <TableRow key={ride._id}>
                      <TableCell className="font-medium">{ride.from}</TableCell>
                      <TableCell>{ride.to}</TableCell>
                      <TableCell>{ride.driver?.name || 'Unknown'}</TableCell>
                      <TableCell>${ride.price}</TableCell>
                      <TableCell>
                        <Badge variant={ride.status === 'available' ? "success" : "secondary"}>
                          {ride.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No rides found in the database.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Ride</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">{booking.passengerId?.name || 'Unknown'}</TableCell>
                      <TableCell>{booking.rideId?.from} to {booking.rideId?.to}</TableCell>
                      <TableCell>{booking.seatsBooked}</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === 'confirmed' ? "success" : 
                          booking.status === 'pending' ? "warning" : 
                          booking.status === 'cancelled' ? "destructive" : 
                          "secondary"
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(booking.createdAt), 'PPP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found in the database.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;