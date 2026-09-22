import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, DoorOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { roomService } from '@/services/room.service';
import { Room } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await roomService.getAll();
      setRooms(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch rooms from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await roomService.delete(deleteId);
      toast({ title: 'Success', description: 'Room deleted from inventory.' });
      setDeleteId(null);
      fetchRooms();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete room. It may be linked to admission records.';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  const columns = [
    {
      header: 'Room #',
      accessor: (r: any) => <span className="font-bold text-slate-900">{r.roomNumber}</span>
    },
    {
      header: 'Ward / Room Type',
      accessor: (r: any) => <span className="font-medium text-slate-800">{r.roomType}</span>
    },
    {
      header: 'Floor',
      accessor: (r: any) => <span className="text-xs text-slate-600 font-medium">Floor {r.floorNumber}</span>
    },
    {
      header: 'Tariff / Day',
      accessor: (r: any) => <span className="font-bold text-slate-900 text-xs">₹{Number(r.dailyCharge).toLocaleString('en-IN')}/day</span>
    },
    {
      header: 'Occupancy Status',
      accessor: (r: any) => <StatusBadge status={r.status} />
    },
    ...(isAdmin ? [{
      header: 'Actions',
      accessor: (r: any) => {
        const roomId = r.id || r.roomId;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/rooms/${roomId}/edit`)}
              className="h-8 w-8 p-0 text-slate-500 hover:text-primary-700"
              title="Edit Room"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteId(roomId)}
              className="h-8 w-8 p-0 text-slate-500 hover:text-destructive"
              title="Delete Room"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      }
    }] : [])
  ];

  const availableCount = rooms.filter(r => r.status?.toUpperCase() === 'AVAILABLE').length;
  const occupiedCount = rooms.filter(r => r.status?.toUpperCase() === 'OCCUPIED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inpatient Wards & Room Bed Management"
        description="Room inventory, occupancy allocation, and daily tariff tiers."
        action={
          <div className="flex items-center gap-3">
            <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 px-2.5 text-xs"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-7 px-2.5 text-xs"
              >
                <List className="h-3.5 w-3.5 mr-1" /> Table
              </Button>
            </div>
            {isAdmin && (
              <Button onClick={() => navigate('/rooms/new')} className="bg-primary-700 hover:bg-primary-800 text-xs font-bold">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Room
              </Button>
            )}
          </div>
        }
      />

      {/* KPI Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Inpatient Rooms</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{rooms.length} Rooms</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Available For Admission</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{availableCount} Rooms</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Currently Occupied</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{occupiedCount} Rooms</p>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {rooms.map((room: any) => {
            const roomId = room.id || room.roomId;
            const isAvail = room.status?.toUpperCase() === 'AVAILABLE';
            const isOccupied = room.status?.toUpperCase() === 'OCCUPIED';
            return (
              <Card
                key={roomId}
                className={cn(
                  "border transition-all hover:shadow-sm rounded-xl overflow-hidden",
                  isAvail ? "border-emerald-200 bg-emerald-50/20" : isOccupied ? "border-amber-200 bg-amber-50/20" : "border-slate-200"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-black text-slate-900">{room.roomNumber}</span>
                    <StatusBadge status={room.status} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{room.roomType}</p>
                  <p className="text-2xs text-slate-500 mt-0.5">Floor {room.floorNumber}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 text-3xs uppercase font-bold block">Tariff</span>
                      <span className="font-bold text-slate-900">₹{room.dailyCharge}/day</span>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/rooms/${roomId}/edit`)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-primary-700 hover:bg-slate-100"
                          title="Edit Room"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(roomId)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                          title="Delete Room"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <DataTable
          data={rooms}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Search rooms..."
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Room"
        description="Are you sure you want to remove this room from the hospital inventory? This action cannot be undone."
        confirmText="Delete Room"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
