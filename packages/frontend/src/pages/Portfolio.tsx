import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Family, FamilyMember, Portfolio as PortfolioType, AssetClass } from '../types/portfolio';

export const Portfolio = () => {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openPortfolioDialog, setOpenPortfolioDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    relation: 'spouse',
  });
  const [newPortfolio, setNewPortfolio] = useState<Partial<PortfolioType>>({
    name: '',
    description: '',
  });

  // Load family data from localStorage
  useEffect(() => {
    const storedFamilies = localStorage.getItem('families');
    if (storedFamilies) {
      const families: Family[] = JSON.parse(storedFamilies);
      const currentFamily = families.find(f => f.id === familyId);
      if (currentFamily) {
        setFamily(currentFamily);
      }
    }
  }, [familyId]);

  // Save family data to localStorage whenever it changes
  useEffect(() => {
    if (family) {
      const storedFamilies = localStorage.getItem('families');
      const families: Family[] = storedFamilies ? JSON.parse(storedFamilies) : [];
      const updatedFamilies = families.map(f => f.id === family.id ? family : f);
      localStorage.setItem('families', JSON.stringify(updatedFamilies));
    }
  }, [family]);

  const handleAddMember = () => {
    if (family && newMember.name && newMember.relation) {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name: newMember.name,
        relation: newMember.relation as 'self' | 'spouse' | 'child' | 'parent' | 'other',
        portfolios: [],
      };
      setFamily({
        ...family,
        members: [...family.members, member],
      });
      setOpenMemberDialog(false);
      setNewMember({ name: '', relation: 'spouse' });
    }
  };

  const handleAddPortfolio = () => {
    if (family && selectedMember && newPortfolio.name) {
      const portfolio: PortfolioType = {
        id: Date.now().toString(),
        name: newPortfolio.name,
        description: newPortfolio.description,
        assetClasses: [],
        totalValue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setFamily({
        ...family,
        members: family.members.map(member =>
          member.id === selectedMember
            ? { ...member, portfolios: [...member.portfolios, portfolio] }
            : member
        ),
      });
      
      setOpenPortfolioDialog(false);
      setNewPortfolio({ name: '', description: '' });
      setSelectedMember(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (family) {
      setFamily({
        ...family,
        members: family.members.filter(member => member.id !== memberId),
      });
    }
  };

  const handleDeletePortfolio = (memberId: string, portfolioId: string) => {
    if (family) {
      setFamily({
        ...family,
        members: family.members.map(member =>
          member.id === memberId
            ? { ...member, portfolios: member.portfolios.filter(p => p.id !== portfolioId) }
            : member
        ),
      });
    }
  };

  if (!family) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Family not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Families
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            component="button"
            variant="body1" 
            onClick={() => navigate('/')}
            underline="hover"
            color="inherit"
          >
            Families
          </Link>
          <Typography color="text.primary">{family.name}</Typography>
        </Breadcrumbs>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1">
            {family.name} Portfolios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenMemberDialog(true)}
          >
            Add Family Member
          </Button>
        </Box>
        {family.description && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {family.description}
          </Typography>
        )}
      </Box>

      {/* Members and their Portfolios */}
      <Grid container spacing={3}>
        {family.members.map((member) => (
          <Grid item xs={12} key={member.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Box>
                  <Typography variant="h6" component="h2">
                    {member.name}
                    <Typography 
                      component="span" 
                      color="text.secondary" 
                      sx={{ ml: 1, fontSize: '0.9rem' }}
                    >
                      ({member.relation})
                    </Typography>
                  </Typography>
                </Box>
                <Box>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedMember(member.id);
                      setOpenPortfolioDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Add Portfolio
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Member's Portfolios */}
              <Grid container spacing={2}>
                {member.portfolios.map((portfolio) => (
                  <Grid item xs={12} md={6} lg={4} key={portfolio.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" component="h3">
                            {portfolio.name}
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePortfolio(member.id, portfolio.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        {portfolio.description && (
                          <Typography color="text.secondary" gutterBottom>
                            {portfolio.description}
                          </Typography>
                        )}
                        <Typography variant="body2" gutterBottom>
                          Total Value: ₹{portfolio.totalValue.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Asset Classes: {portfolio.assetClasses.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {member.portfolios.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      backgroundColor: 'background.default',
                      borderRadius: 1
                    }}>
                      <Typography color="text.secondary">
                        No portfolios yet. Click 'Add Portfolio' to create one.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
        {family.members.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 1
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No family members added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add family members to start managing their portfolios
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenMemberDialog(true)}
              >
                Add Family Member
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Add Member Dialog */}
      <Dialog 
        open={openMemberDialog} 
        onClose={() => setOpenMemberDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Relation"
            value={newMember.relation}
            onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
          >
            <MenuItem value="spouse">Spouse</MenuItem>
            <MenuItem value="child">Child</MenuItem>
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddMember}
            variant="contained"
            disabled={!newMember.name}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Portfolio Dialog */}
      <Dialog 
        open={openPortfolioDialog} 
        onClose={() => setOpenPortfolioDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Name"
            fullWidth
            value={newPortfolio.name}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={newPortfolio.description}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPortfolioDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddPortfolio}
            variant="contained"
            disabled={!newPortfolio.name}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;
