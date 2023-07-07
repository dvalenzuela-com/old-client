import { ABProductTag } from '@Alabarra/alabarra-types';
import { arrayWithoutItem } from '@Lib/helpers';
import {
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';

type FilterModalProps = {
  selectedTags: ABProductTag[];
  onSelectionChange: (newSelectedTags: ABProductTag[]) => void;
  open: boolean;
  onClose: () => void;
};

const FilterModal = ({ selectedTags, onSelectionChange, open, onClose }: FilterModalProps) => {
  const allProductTags = Object.values(ABProductTag);

  const handleSelectTag = (tag: ABProductTag, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTags, tag]);
    } else {
      onSelectionChange(arrayWithoutItem(selectedTags, tag));
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
        <FormLabel component='legend'>Product tags</FormLabel>
        <FormGroup>
          {allProductTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <FormControlLabel
                key={tag}
                control={
                  <Checkbox
                    checked={isSelected}
                    onChange={(e, checked) => {
                      handleSelectTag(tag, checked);
                    }}
                    name={tag}
                  />
                }
                label={tag}
              />
            );
          })}
        </FormGroup>
        <FormHelperText>
          Be sure this is correct, as users may make dietary decisions based on this
        </FormHelperText>
      </FormControl>
    </Dialog>
  );
};

export default FilterModal;
