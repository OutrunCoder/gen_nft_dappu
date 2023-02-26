import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";


const MintBtn = ({ provider, nftContract, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const handleMintRequest = async(e) => {
    e.preventDefault();
    setIsWaiting(true);
    console.log('>> Sending mint request...');

    try {
      // TODO - EXTEND FORM TO MINT MULTIPLE
      const signer = await provider.getSigner();
      const trx = await nftContract.connect(signer).mint(1, { value: cost });
      await trx.wait();

      setIsLoading(true);
    } catch(err) {
      console.error('(!) MINTING FAILED:', err);
      window.alert('(!) User rejected or transaction reverted. (!)');
    }
  };

  return (
    <Form onSubmit={handleMintRequest} style={{ maxWidth: '450px', margin: '50px auto' }}>
      <Form.Group>
        {isWaiting ? (
          <Spinner animation="border" style={{ display: 'block', margin: '0 auto'}}/>
        ) : (
          <Button variant='primary' type='submit' style={{ width: '100%'}}>
            Mint
          </Button>
        )}

      </Form.Group>
    </Form>
  );
}

export default MintBtn;