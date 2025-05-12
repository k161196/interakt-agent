import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

const Popup: React.FC = () => {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up message listener for INTERAKT_WALLET_BALANCE');
    chrome.runtime.onMessage.addListener((message) => {
      console.log('Received message in popup:', message);
      if (message.type === 'INTERAKT_WALLET_BALANCE') {
        console.log('Updating balance to:', message.balance);
        setBalance(message.balance);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="w-[300px] p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">₹{balance}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Popup; 