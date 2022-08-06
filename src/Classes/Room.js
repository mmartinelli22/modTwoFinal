// I should see a dashboard page that shows me:
// Any room bookings I have made (past or upcoming)
// The total amount I have spent on rooms

// {"rooms":[{"number":1,"roomType":"residential suite","bidet":true,"bedSize":"queen","numBeds":1,"costPerNight":358.4}

export class Room {
    constructor(data) {
        this.number = data?.number ?? 0;
        this.roomType = data?.roomType ?? '';
        this.bidet = data?.bidet ?? false;
        this.bedSize = data?.bedSize ?? '';
        this.numBeds = data?.numBeds ?? 0;
        this.costPerNight = data?.costPerNight ?? 0;
    }

}