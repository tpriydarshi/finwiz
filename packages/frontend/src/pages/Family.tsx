import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Container,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Family, FamilyMember, CreateFamilyInput, CreateFamilyMemberInput } from '../types/family';
import { familyService } from '../services/familyService';

export const FamilyPage = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [openFamilyDialog, setOpenFamilyDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newFamily, setNewFamily] = useState<CreateFamilyInput>({
    name: '',
    description: '',
  });

  const [newMember, setNewMember] = useState<CreateFamilyMemberInput>({
    name: '',
    email: '',
    role: 'MEMBER',
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const data = await familyService.getFamilies();
      setFamilies(data);
    } catch (err) {
      setError('Failed to fetch families');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async () => {
    if (!newFamily.name) return;

    try {
      setLoading(true);
      const family = await familyService.createFamily(newFamily);
      setFamilies([...families, family]);
      setOpenFamilyDialog(false);
      setNewFamily({ name: '', description: '' });
    } catch (err) {
      setError('Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedFamily || !newMember.name || !newMember.email) return;

    try {
      setLoading(true);
      const member = await familyService.addFamilyMember(selectedFamily.id, newMember);
      
      const updatedFamilies = families.map(family => {
        if (family.id === selectedFamily.id) {
          return {
            ...family,
            members: [...family.members, member],
          };
        }
        return family;
      });
      
      setFamilies(updatedFamilies);
      setOpenMemberDialog(false);
      setNewMember({ name: '', email: '', role: 'MEMBER' });
    } catch (err) {
      setError('Failed to add family member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (familyId: string, memberId: string) => {
    try {
      setLoading(true);
      await familyService.removeFamilyMember(memberId);
      
      const updatedFamilies = families.map(family => {
        if (family.id === familyId) {
          return {
            ...family,
            members: family.members.filter(m => m.id !== memberId),
          };
        }
        return family;
      });
      
      setFamilies(updatedFamilies);
    } catch (err) {
      setError('Failed to remove family member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Page Title Section */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GroupIcon sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h5" component="h1" fontWeight="500">
                My Families
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setOpenFamilyDialog(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Create Family
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {families.map((family) => (
            <Grid item xs={12} md={6} lg={4} key={family.id}>
              <Card 
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <GroupIcon color="primary" />
                    <Typography variant="h6" component="h2" fontWeight="500">
                      {family.name}
                    </Typography>
                  </Box>
                  {family.description && (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {family.description}
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
                    Members ({family.members.length})
                  </Typography>
                  <List dense>
                    {family.members.map((member) => (
                      <ListItem key={member.id}>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {member.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {member.role} • {member.email}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            size="small"
                            onClick={() => handleRemoveMember(family.id, member.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button 
                    size="medium"
                    startIcon={<PersonIcon />}
                    onClick={() => {
                      setSelectedFamily(family);
                      setOpenMemberDialog(true);
                    }}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Add Member
                  </Button>
                  <Button 
                    size="medium"
                    variant="contained"
                    onClick={() => navigate(`/portfolio/${family.id}`)}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    View Portfolios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {families.length === 0 && !loading && (
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  px: 3,
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <GroupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No families created yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first family to start managing portfolios
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenFamilyDialog(true)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Create Family
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Create Family Dialog */}
        <Dialog 
          open={openFamilyDialog} 
          onClose={() => setOpenFamilyDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Family</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Family Name"
              fullWidth
              value={newFamily.name}
              onChange={(e) => setNewFamily({ ...newFamily, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={newFamily.description}
              onChange={(e) => setNewFamily({ ...newFamily, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFamilyDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateFamily}
              variant="contained"
              disabled={!newFamily.name || loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

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
              label="Member Name"
              fullWidth
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              fullWidth
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'HEAD' | 'MEMBER' })}
            >
              <MenuItem value="HEAD">Head</MenuItem>
              <MenuItem value="MEMBER">Member</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddMember}
              variant="contained"
              disabled={!newMember.name || !newMember.email || loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Add Member
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default FamilyPage;
